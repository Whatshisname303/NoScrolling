chrome.storage.sync.set({inputWhen: 0, inputLength: 0});
setupPopup();

async function setupPopup() {
    chrome.storage.sync.get(["scheduledStart", "scheduledEnd"]).then(({scheduledStart, scheduledEnd}) => {
        document.getElementById("status-display").innerText = `Scheduled ${FormatDateText(scheduledStart)}-${FormatDateText(scheduledEnd)}`;
        if (scheduledEnd < new Date().getTime()) {
            document.getElementById("active-wrapper").classList.add("no-display");
            document.getElementById("scheduling-wrapper").classList.remove("no-display");
        } else {
            document.getElementById("scheduling-wrapper").classList.add("no-display");
            document.getElementById("active-wrapper").classList.remove("no-display");
            setTimeout(() => {
                setupPopup();
            }, scheduledEnd - new Date().getTime() + 2000);
        }
    });
}

function FormatDateText(time) {
    let hours = new Date(time).getHours();
    let minutes = new Date(time).getMinutes();
    let suffix = "AM";
    if (hours > 12) {
        hours -= 12;
        suffix = "PM";
    }
    return `${hours}:${minutes} ${suffix}`
}

document.getElementById("when").addEventListener("change", (event) => {
    chrome.storage.sync.set({"inputWhen": event.target.value});
});

document.getElementById("length").addEventListener("change", (event) => {
    chrome.storage.sync.set({"inputLength": event.target.value});
});

document.getElementById("schedule-button").addEventListener("click", async () => {
    const {inputWhen, inputLength} = await chrome.storage.sync.get(["inputWhen", "inputLength"]);

    if (isNaN(inputWhen) || isNaN(inputLength)) {
        alert("must enter numbers");
        return;
    }
    if (inputLength <= 0) {
        alert("cannot last 0 minutes");
        return;
    }
    if (inputWhen < /*30*/ 0) {
        alert("cannot start in less than 0 minutes");
        return;
    }

    const scheduledStart = new Date().getTime() + inputWhen * 60 * 1000;
    const scheduledEnd = scheduledStart + inputLength * 60 * 1000;
    await chrome.storage.sync.set({"scheduledStart": scheduledStart, "scheduledEnd": scheduledEnd});
    setupPopup();
});

document.getElementById("cancel-schedule-button").addEventListener("click", async () => {
    chrome.storage.sync.set({scheduledStart: 0, scheduledEnd: 0});
    setupPopup();
});
