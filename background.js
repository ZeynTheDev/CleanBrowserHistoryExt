// FUNGSI BARU: Pembersih www. seragam
function getCleanHostname(urlStr) {
    try {
        return new URL(urlStr).hostname.replace(/^www\./i, '').toLowerCase();
    } catch(e) { return ""; }
}

// --- Fungsi mengatur badge per tab ---
function updateBadgeForTab(tabId, url) {
    const hostname = getCleanHostname(url);
    if (!hostname) {
        chrome.action.setBadgeText({ text: '', tabId: tabId });
        return;
    }
    
    chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
        let isGhostActive = false;
        
        if (res.activeMode === 'blacklist') {
            isGhostActive = res.blacklist.includes(hostname);
        } else {
            isGhostActive = !res.whitelist.includes(hostname);
        }

        if (isGhostActive) {
            chrome.action.setBadgeText({ text: 'ON', tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: '#188038', tabId: tabId });
        } else {
            chrome.action.setBadgeText({ text: '', tabId: tabId });
        }
    });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) updateBadgeForTab(activeInfo.tabId, tab.url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.status === 'complete') {
        updateBadgeForTab(tabId, tab.url);
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.activeMode || changes.blacklist || changes.whitelist) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if(tabs[0]) updateBadgeForTab(tabs[0].id, tabs[0].url);
        });
    }
});

// --- LOGIKA UTAMA: Filter dan Hapus Histori ---
chrome.history.onVisited.addListener((historyItem) => {
    const hostname = getCleanHostname(historyItem.url);
    if (!hostname) return;
    
    chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
        let shouldDelete = false;
        
        if (res.activeMode === 'blacklist') {
            shouldDelete = res.blacklist.includes(hostname);
        } else {
            shouldDelete = !res.whitelist.includes(hostname);
        }

        if (shouldDelete) {
            chrome.history.deleteUrl({ url: historyItem.url });
            console.log(`[${res.activeMode.toUpperCase()}] Ghost Mode AKTIF - Jejak dihapus: ${hostname}`);
        }
    });
});