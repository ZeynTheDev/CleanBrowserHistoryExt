const tabBtns = document.querySelectorAll('.tab-btn');
const siteInput = document.getElementById('siteInput');
const addBtn = document.getElementById('addBtn');
const siteList = document.getElementById('siteList');

let currentMode = 'blacklist'; // Default
let lists = { blacklist: [], whitelist: [] };

// Inisialisasi awal
chrome.storage.local.get(['theme', 'activeMode', 'blacklist', 'whitelist', 'lang'], (res) => {
    if (res.theme === 'light') document.body.classList.add('light-mode');
    
    currentMode = res.activeMode || 'blacklist';
    lists.blacklist = res.blacklist || [];
    lists.whitelist = res.whitelist || [];
    
    // Terapkan bahasa
    const currentLang = res.lang || 'en'; // Default English
    langSelect.value = currentLang;
    applyLanguage(currentLang);
    
    updateTabUI();
    renderList();
});

// Logika Klik Tab
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentMode = e.target.getAttribute('data-mode');
        chrome.storage.local.set({ activeMode: currentMode });
        updateTabUI();
        renderList();
    });
});

function updateTabUI() {
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-mode') === currentMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function renderList() {
    siteList.innerHTML = '';
    const activeArray = lists[currentMode];
    
    if (activeArray.length === 0) {
        siteList.innerHTML = '<div class="empty-state"><span data-i18n="empty_state"></span></div>';
        applyLanguage(langSelect.value)
        return;
    }

    // Tambahkan parameter 'index' untuk memudahkan update data spesifik
    activeArray.forEach((site, index) => {
        const li = document.createElement('li');
        li.className = 'site-item';
        
        // 1. Teks Situs (dibungkus span agar mudah disembunyikan)
        const textSpan = document.createElement('span');
        textSpan.className = 'site-text';
        textSpan.textContent = site;
        
        // 2. Container Tombol
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-buttons';
        
        // 3. Tombol Edit (Ikon Pena)
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
        editBtn.className = 'icon-btn';
        editBtn.title = 'Edit URL';
        
        // 4. Tombol Hapus (Ikon Silang)
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        delBtn.className = 'icon-btn';
        delBtn.title = 'Remove Site';
        delBtn.onclick = () => removeSite(site); // Tetap menggunakan fungsi lama milikmu
        
        // 5. Logika Inline Edit
        editBtn.onclick = () => {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = site;
            inputField.className = 'edit-input';
            
            // Sembunyikan teks asli dan tombol edit
            textSpan.style.display = 'none';
            editBtn.style.display = 'none';
            
            // Masukkan input field ke dalam list dan otomatis fokus
            li.insertBefore(inputField, actionsDiv);
            inputField.focus();
            
            // Fungsi untuk menyimpan perubahan
            const saveEdit = () => {
                let newUrl = inputField.value.trim().toLowerCase();
                // Filter URL agar konsisten dengan fitur add (sementara masih potong path)
                newUrl = newUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace(/\/$/, "");
                
                // Jika URL ada nilainya, dan berbeda dengan sebelumnya
                if (newUrl && newUrl !== site) {
                    // Cek apakah URL baru sudah ada di daftar untuk cegah duplikat
                    if (!lists[currentMode].includes(newUrl)) {
                        lists[currentMode][index] = newUrl; // Update array di index tersebut
                        chrome.storage.local.set({ [currentMode]: lists[currentMode] }, () => {
                            renderList(); // Render ulang dengan data baru
                        });
                    } else {
                        renderList(); // Jika duplikat, batalkan edit dan kembali ke awal
                    }
                } else {
                    renderList(); // Jika kosong atau tidak berubah, kembalikan saja
                }
            };
            
            // Simpan saat tekan Enter
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
            });
            
            // Simpan saat klik di luar kotak (blur)
            // Menggunakan flag agar saveEdit tidak tereksekusi 2x (saat enter dan blur terjadi bersamaan)
            let isSaved = false;
            inputField.addEventListener('blur', () => {
                if (!isSaved) { isSaved = true; saveEdit(); }
            });
        };
        
        // 6. Susun Elemennya
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);
        
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);
        
        siteList.appendChild(li);
    });
}

siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
});

addBtn.addEventListener('click', () => {
    let newSite = siteInput.value.trim().toLowerCase();
    newSite = newSite.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace(/\/$/, "");

    if (!newSite) return; // Kalau kosong, abaikan saja

    if (!lists[currentMode].includes(newSite)) {
        // Skenario Sukses: Tambahkan ke daftar
        lists[currentMode].push(newSite);
        chrome.storage.local.set({ [currentMode]: lists[currentMode] }, () => {
            renderList();
            siteInput.value = ''; 
            siteInput.classList.remove('input-error'); // Bersihkan sisa error
            siteInput.focus();
        });
    } else {
        // Skenario Gagal (Duplikat): Beri efek getar
        siteInput.classList.remove('input-error');
        void siteInput.offsetWidth; // Trik ajaib untuk me-reset animasi CSS
        siteInput.classList.add('input-error');
    }
});

function removeSite(siteToRemove) {
    lists[currentMode] = lists[currentMode].filter(site => site !== siteToRemove);
    chrome.storage.local.set({ [currentMode]: lists[currentMode] }, () => {
        renderList();
    });
}

// --- LOGIKA NAVIGASI SIDEBAR ---
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus kelas aktif dari semua
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Tambahkan ke yang diklik
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
});

// --- LOGIKA HALAMAN HOTKEY ---
// 1. Tampilkan hotkey saat ini
chrome.commands.getAll((commands) => {
    for (let cmd of commands) {
        if (cmd.name === 'toggle-ghost-mode') {
            document.getElementById('displayShortcut').textContent = cmd.shortcut || "Not Set";
            break;
        }
    }
});

// 2. Buka Pengaturan Bawaan Chrome
document.getElementById('openShortcutsBtn').addEventListener('click', () => {
    // Membuka tab baru ke halaman shortcut Chrome
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

// --- LOGIKA TEMA & SINKRONISASI REAL-TIME ---
const themeToggleBtn = document.getElementById('themeToggleBtn');

// 1. Eksekusi saat tombol tema di halaman Options diklik
themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
});

// 2. Dengarkan perubahan dari Popup secara Live!
chrome.storage.onChanged.addListener((changes) => {
    if (changes.theme) {
        if (changes.theme.newValue === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }
});

// --- LOGIKA EXPORT & IMPORT (BACKUP) ---
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// 1. Eksekusi Export (Download JSON)
exportBtn.addEventListener('click', () => {
    // Ubah data arrays menjadi string JSON yang rapi (indentasi 2 spasi)
    const dataStr = JSON.stringify(lists, null, 2);
    // Buat "file" sementara di memori browser
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Buat link tak terlihat untuk memicu download otomatis
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0]; // Ambil tanggal hari ini (YYYY-MM-DD)
    a.download = `GhostMode_Backup_${date}.json`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Bersihkan memori
});

// 2. Eksekusi Import (Memicu jendela pilih file)
importBtn.addEventListener('click', () => importFile.click());

// 3. Baca File JSON yang diunggah
importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            
            // Validasi: Pastikan filenya punya format arrays blacklist & whitelist yang benar
            if (importedData.blacklist && Array.isArray(importedData.blacklist) && 
                importedData.whitelist && Array.isArray(importedData.whitelist)) {
                
                if (confirm(i18n[langSelect.value].alert_import_confirm)) {
                    lists.blacklist = importedData.blacklist;
                    lists.whitelist = importedData.whitelist;
                    
                    chrome.storage.local.set({ blacklist: lists.blacklist, whitelist: lists.whitelist }, () => {
                        renderList(); // Render ulang tampilan
                        alert(i18n[langSelect.value].alert_import_success);
                        // alert('Backup successfully imported! 🎉');
                    });
                }
            } else {
                alert(i18n[langSelect.value].alert_import_invalid);
                // alert('Invalid backup file! Make sure it is a valid Ghost Mode JSON backup.');
            }
        } catch (err) {
            alert(i18n[langSelect.value].alert_import_error);
            // alert('Error reading the file. The JSON format might be corrupted.');
        }
        importFile.value = ''; // Reset input agar bisa import file yang sama lagi jika perlu
    };
    reader.readAsText(file);
});

// --- KAMUS BAHASA (DICTIONARY) ---
const i18n = {
    en: {
		"ph_site": "e.g. x.com, youtube.com",
        "nav_settings": "Settings",
        "nav_sites": "Site Management",
        "nav_shortcuts": "Shortcuts",
        "mode_title": "Operation Mode & Site List",
        "mode_desc": "Choose a mode, then adjust the site list:",
        "tab_blacklist": "Erase Listed Only",
        "tab_whitelist": "Never Erase Listed",
        "btn_add": "Add Site",
        "btn_export": "Export",
        "btn_import": "Import",
        "empty_state": "No sites in this list yet.",
        "alert_import_confirm": "Are you sure? This will OVERWRITE your current site lists.",
        "alert_import_success": "Backup successfully imported! 🎉",
        "alert_import_invalid": "Invalid backup file! Make sure it is a valid Ghost Mode JSON backup.",
        "alert_import_error": "Error reading the file. The JSON format might be corrupted.",
        "active_shortcut_now": "Current Active Shortcut:",
        "caution_strong": "⚠️ CAUTION!",
        "caution_desc": "Please be cautious on setting the hotkey since some mapping was applied on your browser previously. Use unused hotkeys for preventing hotkey logic crash.",
        "caution_guide": "To change or reset this hotkey to default, you must use the native browser extension settings.",
        "btn_open_shortcuts": "Open Browser Shortcut Settings"
    },
    id: {
		"ph_site": "misal: x.com, youtube.com",
		"ph_site": "misal: x.com, youtube.com",
        "nav_settings": "Pengaturan",
        "nav_sites": "Manajemen Situs",
        "nav_shortcuts": "Pintasan",
        "mode_title": "Mode Operasi & Daftar Situs",
        "mode_desc": "Pilih mode, lalu atur daftar situsnya masing-masing:",
        "tab_blacklist": "Hapus Daftar Saja",
        "tab_whitelist": "Jangan Hapus Daftar",
        "btn_add": "Tambah",
        "btn_export": "Ekspor",
        "btn_import": "Impor",
        "empty_state": "Belum ada situs dalam daftar ini.",
        "alert_import_confirm": "Apakah kamu yakin? Ini akan MENIMPA seluruh daftar situsmu saat ini.",
        "alert_import_success": "Backup berhasil diimpor! 🎉",
        "alert_import_invalid": "File backup tidak valid! Pastikan ini adalah file JSON Ghost Mode yang benar.",
        "alert_import_error": "Terjadi kesalahan saat membaca file. Format JSON mungkin rusak.",
        "active_shortcut_now": "Pintasan Aktif Terkini:",
        "caution_strong": "⚠️ PERINGATAN!",
        "caution_desc": "Harap berhati-hati dalam mengatur hotkey karena beberapa pemetaan sudah diterapkan pada browser Anda sebelumnya. Gunakan hotkey yang tidak digunakan untuk mencegah tabrakan logika hotkey.",
        "caution_guide": "Untuk mengganti atau mengembalikan hotkey seperti pengaturan semula, kamu harus menggunakan pengaturan ekstensi bawaan browser.",
        "btn_open_shortcuts": "Buka Pengaturan Pintasan Browser"
    }
};

const langSelect = document.getElementById('langSelect');

// Fungsi penyapu halaman untuk mengganti teks
function applyLanguage(lang) {
    // 1. Ganti inner teks
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
    });
    
    // 2. Ganti teks placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[lang] && i18n[lang][key]) el.placeholder = i18n[lang][key];
    });
}

// Dengarkan perubahan pada dropdown bahasa
langSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    chrome.storage.local.set({ lang: selectedLang }, () => {
        applyLanguage(selectedLang);
    });
});