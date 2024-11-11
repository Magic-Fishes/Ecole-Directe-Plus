export default class IframeRequestLinker {
    constructor() {
        this.iframeWindow = null;
        this.fetchQueue = [];
        this.solverList = {};
        window.addEventListener("message", this.#handleMessage.bind(this), false);
    }

    #handleMessage(event) {
        const { action, values } = event.data;
        const { fetchId, result } = values;
        switch (action) {
            case "RESPONSE":
                this.solverList[fetchId].resolve(result);
                delete this.solverList[fetchId]
                return;
            case "ERROR":
                this.solverList[fetchId].reject(result);
                delete this.solverList[fetchId]
                return;
        }
    }

    #sendIframeAbort(fetchId) {
        this.iframeWindow.postMessage({ action: "ABORT", values: { fetchId } }, "*");
    }

    #sendIframeFetch(url, fetchParams, dataType, solver) {
        const fetchId = crypto.randomUUID();
        this.solverList[fetchId] = solver;
        const fetchSignal = fetchParams.signal;
        if (fetchSignal) {
            fetchSignal.onabort = () => {
                this.#sendIframeAbort(fetchId);
            }
        }
        delete fetchParams.signal;
        this.iframeWindow.postMessage({ action: "FETCH", values: { url, fetchParams, dataType, fetchId } }, "*");
    }

    async fetch(url, fetchParams, dataType = "json") {
        return new Promise((resolve, reject) => {
            if (this.iframeWindow === null) {
                this.fetchQueue.push({ url, fetchParams, dataType, solver: { resolve, reject } });
            } else {
                this.#sendIframeFetch(url, fetchParams, dataType, { resolve, reject });
            }
        })
    }

    setIframe(iframe) {
        this.iframeWindow = iframe.contentWindow;
        if (this.iframeWindow !== null) {
            this.fetchQueue.forEach(element => {
                if (!element.fetchParams.signal.aborted) {
                    this.#sendIframeFetch(...element);
                }
            });
            this.fetchQueue = [];
        }
    }
}