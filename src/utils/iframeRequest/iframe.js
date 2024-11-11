/* WARNING /!\ If you modify this file, you'll need to stop and restart your current npm script (do 'npm run dev' again) to see changes /!\ WARNING */
(() => {
    const abortionList = {};

    function handleFetch(source, values) {
        const { url, fetchParams, dataType, fetchId } = values;
        const abortController = new AbortController();
        abortionList[fetchId] = abortController;
        fetchParams.signal = abortController.signal;
        fetch(url, fetchParams)
            .then((response) => response[dataType]())
            .then((response) => {
                source.postMessage({ action: "RESPONSE", values: { fetchId, result: response }}, "*");
            })
            .catch((error) => {
                source.postMessage({ action: "ERROR", values: { fetchId, result: error } }, "*");
            })
            .finally(() => {
                delete abortionList[fetchId];
            })
    }

    function handleAbort(values) {
        if (abortionList[values.fetchId]) {
            abortionList[values.fetchId].abort();
            delete abortionList[values.fetchId];
        }
    }

    function handleMessage(event) {
        const {action, values} = event.data;
        switch (action) {
            case "FETCH":
                handleFetch(event.source, values);
                return;
            case "ABORT":
                handleAbort(values);
                return;
        }
    };
    
    window.addEventListener("message", handleMessage, false);

})()