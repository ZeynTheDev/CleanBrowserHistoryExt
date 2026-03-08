// --- Fungsi mengatur badge per tab ---
function updateBadgeForTab(tabId, url) {
    if (!url) {
        chrome.action.setBadgeText({ text: '', tabId: tabId });
        return;
    }
    try {
        const hostname = new URL(url).hostname;
        chrome.storage.local.get({ ghostSites: [] }, (res) => {
            if (res.ghostSites.includes(hostname)) {
                chrome.action.setBadgeText({ text: 'ON', tabId: tabId });
                chrome.action.setBadgeBackgroundColor({ color: '#188038', tabId: tabId });
            } else {
                chrome.action.setBadgeText({ text: '', tabId: tabId });
            }
        });
    } catch (e) {
        chrome.action.setBadgeText({ text: '', tabId: tabId });
    }
}

// --- Listener: Saat pindah tab ---
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) updateBadgeForTab(activeInfo.tabId, tab.url);
    });
});

// --- Listener: Saat tab di-refresh atau ganti URL ---
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.status === 'complete') {
        updateBadgeForTab(tabId, tab.url);
    }
});

// --- Listener: Saat toggle di popup ditekan ---
chrome.storage.onChanged.addListener((changes) => {
    if (changes.ghostSites) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if(tabs[0]) updateBadgeForTab(tabs[0].id, tabs[0].url);
        });
    }
});

// --- LOGIKA UTAMA: Filter dan Hapus Histori ---
chrome.history.onVisited.addListener((historyItem) => {
    if (!historyItem.url) return;
    
    try {
        const hostname = new URL(historyItem.url).hostname;
        chrome.storage.local.get({ ghostSites: [] }, (res) => {
            // Jika hostname saat ini ada di daftar ghostSites, hapus historinya!
            if (res.ghostSites.includes(hostname)) {
                chrome.history.deleteUrl({ url: historyItem.url });
                console.log(`Ghost Mode AKTIF - Jejak dihapus untuk domain: ${hostname}`);
            }
        });
    } catch (e) {
        // Abaikan jika URL tidak valid (seperti about:blank)
    }
});