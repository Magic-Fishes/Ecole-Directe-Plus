// Import necessary components and utilities
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DOMNotification from "./components/generic/PopUps/Notification";
import App from "./App";
import IframeRequestLinker from "./utils/iframeRequest/iframeRequestLinker";
import { getOS } from "./utils/utils";

// Handle removal of splash screen after a 500ms delay
const handleRemoveSplashScreen = () => {
    // Get the splash screen element
    const splashScreen = document.getElementById("loading-start");
    // Add fade-out class and remove after delay
    splashScreen?.classList.add("fade-out");
    setTimeout(() => splashScreen?.remove(), 500);
};

// Handle iframe load event
const handleIframeLoad = (event) => {
    // Initialize iframeRequest with loaded iframe
    const iframeRequest = new IframeRequestLinker();
    iframeRequest.setIframe(event.target);
};

// Function to make a fetch request
async function edpFetch(url, fetchParams, dataType) {
    // Perform fetch request and return response in desired data type
    return fetch(url, fetchParams).then((response) => response[dataType]());
};

// Initialize App component with required props
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <DOMNotification>
            {/* App component with edpFetch function */}
            <App 
                edpFetch={["Windows", "Linux"].includes(getOS()) ? 
                    // If OS is Windows or Linux, use edpFetch function
                    edpFetch : 
                    // Otherwise, use iframeRequest fetch function
                    new IframeRequestLinker().fetch.bind(new IframeRequestLinker())} 
            />
            {/* Iframe for loading request */}
            <iframe 
                onLoad={handleIframeLoad} 
                sandbox="allow-scripts" 
                style={{display: "none"}} 
                srcDoc='data:text/html, <!DOCTYPE HTML><html><head></head><body><script>IFRAME_JS_PLACEHOLDER</script></body></html>'>
            </iframe>
        </DOMNotification>
    </StrictMode>
);

// Remove splash screen
handleRemoveSplashScreen();
