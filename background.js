// FUNGSI BARU: Hostname + Path
function getMatchableUrl(urlStr) {
    try {
        let parsed = new URL(urlStr);
        let hostname = parsed.hostname.replace(/^www\./i, '').toLowerCase();
        let pathname = parsed.pathname === '/' ? '' : parsed.pathname;
        return hostname + pathname;
    } catch(e) { return ""; }
}

// --- Fungsi mengatur badge per tab ---
function updateBadgeForTab(tabId, url) {
    const matchableUrl = getMatchableUrl(url);
    if (!matchableUrl) {
        chrome.action.setBadgeText({ text: '', tabId: tabId });
        return;
    }
    
    chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
        let isGhostActive = false;
        
        if (res.activeMode === 'blacklist') {
            isGhostActive = res.blacklist.some(rule => matchableUrl.startsWith(rule));
        } else {
            isGhostActive = !res.whitelist.some(rule => matchableUrl.startsWith(rule));
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
    const matchableUrl = getMatchableUrl(historyItem.url);
    if (!matchableUrl) return;
    
    chrome.storage.local.get({ activeMode: 'blacklist', blacklist: [], whitelist: [] }, (res) => {
        let shouldDelete = false;
        
        if (res.activeMode === 'blacklist') {
            shouldDelete = res.blacklist.some(rule => matchableUrl.startsWith(rule));
        } else {
            shouldDelete = !res.whitelist.some(rule => matchableUrl.startsWith(rule));
        }

        if (shouldDelete) {
            chrome.history.deleteUrl({ url: historyItem.url });
            console.log(`[${res.activeMode.toUpperCase()}] Ghost Mode ACTIVATED - History deleted: ${matchableUrl}`);
        }
    });
});