const tabBtns = document.querySelectorAll('.tab-btn');
const siteInput = document.getElementById('siteInput');
const addBtn = document.getElementById('addBtn');
const siteList = document.getElementById('siteList');

let currentMode = 'blacklist'; // Default
let lists = { blacklist: [], whitelist: [] };

// Inisialisasi awal
chrome.storage.local.get(['theme', 'activeMode', 'blacklist', 'whitelist'], (res) => {
    if (res.theme === 'light') document.body.classList.add('light-mode');
    
    currentMode = res.activeMode || 'blacklist';
    lists.blacklist = res.blacklist || [];
    lists.whitelist = res.whitelist || [];
    
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
        siteList.innerHTML = '<div class="empty-state">No sites in this list yet.</div>';
        return;
    }

    activeArray.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌ Remove';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => removeSite(site);
        
        li.appendChild(delBtn);
        siteList.appendChild(li);
    });
}

siteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); }
});

addBtn.addEventListener('click', () => {
    let newSite = siteInput.value.trim().toLowerCase();
    newSite = newSite.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

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