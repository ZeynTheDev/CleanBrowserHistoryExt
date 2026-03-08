const toggle = document.getElementById('ghostToggle');
const siteDisplay = document.getElementById('currentSite');
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

let currentHostname = "";

// 1. Deteksi Situs Saat Ini & Setel Status Toggle
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(tabs[0] && tabs[0].url) {
        try {
            const url = new URL(tabs[0].url);
            currentHostname = url.hostname;
            siteDisplay.textContent = currentHostname;

            // Cek apakah hostname ini ada di daftar ghostSites
            chrome.storage.local.get({ ghostSites: [] }, (res) => {
                if (res.ghostSites.includes(currentHostname)) {
                    toggle.classList.add('on');
                }
            });
        } catch(e) {
            siteDisplay.textContent = "Halaman Internal";
            toggle.style.pointerEvents = 'none'; // Matikan klik untuk halaman internal browser
            toggle.style.opacity = '0.5';
        }
    }
});

// 2. Baca Setelan Tema
chrome.storage.local.get(['theme'], (res) => {
    if (res.theme === 'light') body.classList.add('light-mode');
});

// 3. Logika Klik Toggle & Simpan Domain
toggle.addEventListener('click', () => {
    if (!currentHostname) return; // Cegah error kalau di halaman internal

    const isCurrentlyOn = toggle.classList.contains('on');
    
    chrome.storage.local.get({ ghostSites: [] }, (res) => {
        let sites = res.ghostSites;
        
        if (!isCurrentlyOn) {
            // Turn ON: Tambahkan ke array
            toggle.classList.add('on');
            if (!sites.includes(currentHostname)) sites.push(currentHostname);
        } else {
            // Turn OFF: Hapus dari array
            toggle.classList.remove('on');
            sites = sites.filter(site => site !== currentHostname);
        }
        
        chrome.storage.local.set({ ghostSites: sites });
    });
});

// 4. Logika Ganti Tema
themeToggleBtn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
});