function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function clearUrlHash() {
    window.history.replaceState(null, "", window.location.pathname);
}

async function dskmc() {
    caches.keys(). then(function(names) {

    for (let name of names)

    caches.delete(name);

    });
    const domain = window.CONFIG?.domain;
    const bundle = window.CONFIG?.bundle;
    const deepLink = window.CONFIG?.deepLink;
    const appsflyerId = getParam("afi");
    const advertisingId = getParam("adv");

    if (!domain || !bundle || !deepLink || !appsflyerId || !advertisingId) {
        throw new Error("Configuration error: variables not set");
    }

    try {
        const response = await axios.get(`https://${domain}/api/v11c`, {
            params: {
                bundle_id: bundle,
                advertising_id: advertisingId,
                appsflyer_device_id: appsflyerId
            }
        }).then(res => res.data).catch(() => {
            clearUrlHash();
            window.location.href = deepLink;
            return
        });

        const url = response?.url || null;
        if (!url) {
            clearUrlHash();
            window.location.href = deepLink;
            return;
        }
        window.location.href = url;
    } catch (err) {
        console.error("Request error: ", err);
    }
}

document.addEventListener("DOMContentLoaded", dskmc);
