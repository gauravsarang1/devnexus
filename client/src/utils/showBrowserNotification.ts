let lastBrowserNotification = 0;

const showBrowserNotification = (
    title: string,
    message: string,
    link?: string
) => {
    const now = Date.now();
    if (now - lastBrowserNotification < 3000) return; // 1 per 3s max
    lastBrowserNotification = now;

    if (
        Notification.permission === "granted" &&
        document.visibilityState !== "visible" &&
        "serviceWorker" in navigator
    ) {
        navigator.serviceWorker.ready.then((reg) =>
            reg.showNotification(title, {
                body: message,
                icon: "./favicon-96x96.png",
                data: { link },
            })
        );
    }
};

export default showBrowserNotification;
