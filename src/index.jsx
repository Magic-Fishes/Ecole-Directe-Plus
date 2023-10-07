import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

// import { HelmetProvider } from 'react-helmet';


const splashScreen = document.getElementById("loading-start");
splashScreen?.classList.add("fade-out");
setTimeout(() => splashScreen?.remove(), 500);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* <HelmetProvider> */}
            <App />
        {/* </HelmetProvider> */}
    </StrictMode>
);

// reportWebVitals(console.log);