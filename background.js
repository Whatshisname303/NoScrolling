let activeTimeout = null;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        inputWhen: 0,
        inputLength: 0,
        scheduledStart: 0,
        scheduledEnd: 0
    });
});


function refresh() {
    chrome.storage.sync.get(["scheduledStart", "scheduledEnd"]).then(({scheduledStart, scheduledEnd}) => {
        chrome.tabs.query({url: "https://www.youtube.com/*"}).then(async (tabs) => {
            const currentTime = new Date().getTime();

            if (currentTime > scheduledStart && currentTime < scheduledEnd) {
                for (const tab of tabs) {
                    console.log("multi removed");
                    chrome.scripting.removeCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                }
                if (activeTimeout) {
                    clearTimeout(activeTimeout)
                }
                activeTimeout = setTimeout(() => {
                    refresh();
                }, scheduledEnd - currentTime + 2000);

            } else {
                for (const tab of tabs) {
                    console.log("removed");
                    chrome.scripting.removeCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                    console.log("inserted")
                    chrome.scripting.insertCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                }

                if (scheduledStart > currentTime) {
                    if (activeTimeout) {
                        clearTimeout(activeTimeout);
                    }
                    activeTimeout = setTimeout(() => {
                        refresh();
                    }, scheduledStart - currentTime + 2000);
                }
            }
        });
    })
}

chrome.tabs.onUpdated.addListener((_, info, tab) => {
    if (tab.url.startsWith("https://www.youtube.com") && info.status == "complete") {
        refresh();
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if ("scheduledEnd" in changes) {
        refresh();
    }
});
