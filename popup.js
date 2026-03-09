const toggle = document.getElementById('ghostToggle');
const siteDisplay = document.getElementById('currentSite');
const themeToggleBtn = document.getElementById('themeToggle');
const optionsBtn = document.getElementById('optionsBtn');
const body = document.body;

let currentHostname = "";
let currentMode = "blacklist";

// FUNGSI BARU: Pembersih www. agar cocok dengan database options.js
function getCleanHostname(urlStr) {
    try {
        return new URL(urlStr).hostname.replace(/^www\./i, '').toLowerCase();
    } catch(e) { return ""; }
}

// 1. Baca Setelan & URL
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs[0] && tabs[0].url) {
        currentHostname = getCleanHostname(tabs[0].url);
        
        if (currentHostname) {
            siteDisplay.textContent = currentHostname;
            
            chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
                currentMode = res.activeMode;
                
                // PERBAIKAN LOGIKA UI: ON berarti "Ghost Mode Aktif (Hapus)"
                let isGhostActive = false;
                if (currentMode === 'blacklist') {
                    isGhostActive = res.blacklist.includes(currentHostname);
                } else {
                    // Di Whitelist, aktif (hapus) jika TIDAK ADA di daftar aman
                    isGhostActive = !res.whitelist.includes(currentHostname);
                }
                
                if (isGhostActive) toggle.classList.add('on');
            });
        } else {
            siteDisplay.textContent = "Halaman Internal";
            toggle.style.pointerEvents = 'none';
            toggle.style.opacity = '0.5';
        }
    }
});

chrome.storage.local.get(['theme'], (res) => {
    if (res.theme === 'light') body.classList.add('light-mode');
});

// 2. Logika Toggle (Menyimpan sesuai makna mode)
toggle.addEventListener('click', () => {
    if (!currentHostname) return;

    const isCurrentlyOn = toggle.classList.contains('on');
    const wantsGhostModeOn = !isCurrentlyOn; // Jika ingin menghapus histori
    
    // Animasi UI Instan
    if (wantsGhostModeOn) toggle.classList.add('on');
    else toggle.classList.remove('on');
    
    chrome.storage.local.get({ blacklist: [], whitelist: [] }, (res) => {
        let bList = res.blacklist;
        let wList = res.whitelist;
        
        if (currentMode === 'blacklist') {
            if (wantsGhostModeOn && !bList.includes(currentHostname)) bList.push(currentHostname);
            if (!wantsGhostModeOn) bList = bList.filter(site => site !== currentHostname);
            chrome.storage.local.set({ blacklist: bList });
        } else {
            // WHITELIST: Jika ON (ingin dihapus), keluarkan dari daftar aman!
            if (wantsGhostModeOn) wList = wList.filter(site => site !== currentHostname);
            // WHITELIST: Jika OFF (ingin disimpan), masukkan ke daftar aman!
            if (!wantsGhostModeOn && !wList.includes(currentHostname)) wList.push(currentHostname);
            chrome.storage.local.set({ whitelist: wList });
        }
    });
});

themeToggleBtn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
});

if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
        else window.open(chrome.runtime.getURL('options.html'));
    });
}

// 6. Ambil Data Hotkey Dinamis
chrome.commands.getAll((commands) => {
    for (let cmd of commands) {
        if (cmd.name === 'toggle-ghost-mode' && cmd.shortcut) {
            document.getElementById('shortcutKey').textContent = cmd.shortcut;
            break;
        }
    }
});