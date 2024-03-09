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
        chrome.tabs.query({url: "https://www.youtube.com/*"}).then((tabs) => {
            const currentTime = new Date().getTime();

            if (scheduledStart < currentTime && currentTime < scheduledEnd) {
                for (const tab of tabs) {
                    chrome.scripting.removeCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                }
                setTimeout(() => {
                    refresh();
                }, scheduledEnd - currentTime + 2000);

            } else {
                for (const tab of tabs) {
                    chrome.scripting.removeCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                    chrome.scripting.insertCSS({
                        files: ["content.css"],
                        target: {tabId: tab.id}
                    });
                }

                if (scheduledStart > currentTime) {
                    setTimeout(() => {
                        refresh();
                    }, scheduledStart - currentTime + 2000);
                }
            }
        });
    })
}

chrome.tabs.onUpdated.addListener((_, __, tab) => {
    if (tab.url.startsWith("https://www.youtube.com")) {
        refresh();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if ("scheduledEnd" in changes) {
        refresh();
    }
});

refresh();
