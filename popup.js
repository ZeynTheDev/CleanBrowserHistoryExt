const toggle = document.getElementById('ghostToggle');
const siteDisplay = document.getElementById('currentSite');
const themeToggleBtn = document.getElementById('themeToggle');
const optionsBtn = document.getElementById('optionsBtn');
const body = document.body;

let currentMatchableUrl = "";
let currentMode = "blacklist";

function getMatchableUrl(urlStr) {
	try {
		let parsed = new URL(urlStr);
		let hostname = parsed.hostname.replace(/^www\./i, '').toLowerCase();
		let pathname = parsed.pathname === '/' ? '' : parsed.pathname;
		return hostname + pathname;
	} catch(e) { return ""; }
}

// 1. Baca Setelan & URL
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs[0] && tabs[0].url) {
        currentMatchableUrl = getMatchableUrl(tabs[0].url);
        
        if (currentMatchableUrl) {
            siteDisplay.textContent = currentMatchableUrl.length > 30 ? currentMatchableUrl.substring(0, 27) + "..." : currentMatchableUrl;
            
            chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
                currentMode = res.activeMode;
                
                // PERBAIKAN LOGIKA UI: ON berarti "Ghost Mode Aktif (Hapus)"
                let isGhostActive = false;
                if (currentMode === 'blacklist') {
					// checking does URL contain one of the blacklist rules
                    isGhostActive = res.blacklist.some(rule => currentMatchableUrl.startsWith(rule));
                } else {
                    // Di Whitelist, aktif (hapus) jika TIDAK ADA di daftar aman
                    isGhostActive = !res.whitelist.some(rule => currentMatchableUrl.startsWith(rule));
                }
                
                if (isGhostActive) toggle.classList.add('on');
            });
        } else {
            siteDisplay.textContent = "Internal Page";
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
    if (!currentMatchableUrl) return; // <-- Sudah diperbaiki

    const isCurrentlyOn = toggle.classList.contains('on');
    const wantsGhostModeOn = !isCurrentlyOn; // Jika ingin menghapus histori
    
    // Animasi UI Instan
    if (wantsGhostModeOn) toggle.classList.add('on');
    else toggle.classList.remove('on');
    
    chrome.storage.local.get({ blacklist: [], whitelist: [] }, (res) => {
        let bList = res.blacklist;
        let wList = res.whitelist;
        
        if (currentMode === 'blacklist') {
            if (wantsGhostModeOn && !bList.includes(currentMatchableUrl)) bList.push(currentMatchableUrl);
            if (!wantsGhostModeOn) bList = bList.filter(site => site !== currentMatchableUrl);
            chrome.storage.local.set({ blacklist: bList });
        } else {
            // WHITELIST: Jika ON (ingin dihapus), keluarkan dari daftar aman!
            if (wantsGhostModeOn) wList = wList.filter(site => site !== currentMatchableUrl);
            // WHITELIST: Jika OFF (ingin disimpan), masukkan ke daftar aman!
            if (!wantsGhostModeOn && !wList.includes(currentMatchableUrl)) wList.push(currentMatchableUrl);
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