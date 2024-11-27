import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import DOMNotification from "./components/generic/PopUps/Notification";
import App from "./App";
import IframeRequestLinker from "./utils/iframeRequest/iframeRequestLinker";
import { getOS } from "./utils/utils";
// import reportWebVitals from './reportWebVitals';
// import { HelmetProvider } from 'react-helmet';

const splashScreen = document.getElementById("loading-start");
const iframeRequest = new IframeRequestLinker();

const handleIframeLoad = (event) => {
    iframeRequest.setIframe(event.target);
};

const edpFetch = async (url, fetchParams, dataType) => {
    const response = await fetch(url, fetchParams);
    return response[dataType]();
};

const SplashScreenRemover = () => {
    useEffect(() => {
        if (splashScreen) {
            splashScreen.classList.add("fade-out");
            setTimeout(() => splashScreen.remove(), 500);
        }
    }, []);
    return null;
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SplashScreenRemover />
        <DOMNotification>
            {/* <HelmetProvider> */}
                <App edpFetch={["Windows", "Linux"].includes(getOS()) ? edpFetch : iframeRequest.fetch.bind(iframeRequest)} />
                <iframe onLoad={handleIframeLoad} sandbox="allow-scripts" style={{ display: "none" }} srcDoc="data:text/html, <!DOCTYPE HTML><html><head></head><body><script>IFRAME_JS_PLACEHOLDER</script></body></html>" />
            {/* </HelmetProvider> */}
        </DOMNotification>
    </StrictMode>
);

// reportWebVitals(console.log);
