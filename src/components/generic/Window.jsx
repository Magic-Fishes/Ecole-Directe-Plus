
import { useState, useEffect, useRef, createContext, useContext, forwardRef } from "react";

import "./Window.css";



function useWindowsContainer(options) {
    /** 
    * available options:
    * animateWindows (bool)
    * allowWindowsManagement (bool)
    */
    const animateWindows = options.animateWindows ?? true;
    const allowWindowsManagement = options.allowWindowsManagement ?? true;
    const windows = [];
    
    return ({
        animateWindows,
        allowWindowsManagement,
        windows
    })
}


const WindowsContainerContext = createContext(null);

function useWindowsContainerContext() {
    // Fonction pour sécuriser la récupération du context
    const context = useContext(WindowsContainerContext);

    if (context === null) {
        throw new Error("WindowsLayout, Window, WindowHeader or WindowContent components must be wrapped in <WindowsContainer />");
    }

    return context;
};



export function WindowsContainer({ children, className="", id="", ...options}) {
    const WindowsContainer = useWindowsContainer(options);

    const [floatingWindows, setFloatingWindows] = useState([]);

    const floatingPortalRef = useRef(null);


    const unfloatWindow = (floatingWindow, targetWindow) => {
        const boundingClientRect = targetWindow.getBoundingClientRect();
        floatingWindow.style.transition = "all 0.4s ease, scale 0.2s ease";
        floatingWindow.style.height = boundingClientRect.height + "px";
        floatingWindow.style.width = boundingClientRect.width + "px";
        floatingWindow.style.left = boundingClientRect.x + "px";
        floatingWindow.style.top = boundingClientRect.y + "px";
        floatingWindow.style.scale = 1;
        
        setTimeout(() => {
            // known bug: if the user drop a window and hold another in the next 400ms the overflow will auto
            document.body.style.overflow = "";
            targetWindow.classList.remove("moving")
            floatingWindow.remove()
        }, 400);
    }

    function handleMouseDown(event) {
        function lookForNearestWindowParent(element) {
            const currentElement = element.parentElement;
            while (!currentElement.classList.contains("window") && currentElement !== null) {
                currentElement = currentElement.parentElement;
            }

            if (currentElement === null) {
                throw new Error("This element: " +  element + " doesn't have a window as its parent, although it's supposed to have one.")
            }

            return currentElement;
        }
        
        const targetWindow = lookForNearestWindowParent(event.target);
        console.log("target:", targetWindow, "| mousedown");

        const floatingWindow = targetWindow.cloneNode(true);
        console.log("floatingWindow:", floatingWindow)


        // mirror the boudingClient
        const boundingClientRect = targetWindow.getBoundingClientRect();
        floatingWindow.style.position = "absolute";
        floatingWindow.style.height = boundingClientRect.height + "px";
        floatingWindow.style.width = boundingClientRect.width + "px";
        floatingWindow.style.left = boundingClientRect.x + "px";
        floatingWindow.style.top = boundingClientRect.y + "px";
        
        targetWindow.classList.add("moving")
        floatingPortalRef.current.appendChild(floatingWindow);

        const handleMouseUp = () => {
            unfloatWindow(floatingWindow, targetWindow);
            // document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        
        document.addEventListener("mouseup", handleMouseUp);
    }

    useEffect(() => {
        function getWindowsHeader(windows) {
            const headers = [];
            for (let windowRef of windows) {
                const windowChildren = windowRef.current.children;
                for (let child of windowChildren) {
                    if (child.classList.contains("window-header")) {
                        headers.push(child);
                    }
                }
            }

            return headers;
        }

        const stopEventPropagation = (event) => {
            console.log("target:", event.target, "| propagation stopped")
            event.stopPropagation();
        }

        console.log("WindowsContainerContext:");
        console.log(WindowsContainer);
        const headers = getWindowsHeader(WindowsContainer.windows)
        console.log("headers:", headers);
        for (let header of headers) {
            header.addEventListener("mousedown", handleMouseDown)
            for (let child of header.children) {
                // will only happen when css property "pointer-events" is not set to "none"
                child.addEventListener("mousedown", stopEventPropagation);
            }
        }

        return () => {
            for (let header of headers) {
                header.removeEventListener("mousedown", handleMouseDown)
                for (let child of header.children) {
                    child.removeEventListener("mousedown", stopEventPropagation)
                }
            }
        }

    }, [floatingWindows]);

    
    return (
        <div id={`windows-container${(id && " " + id)}`} className={className}>
            <WindowsContainerContext.Provider value={WindowsContainer}>
                {children}
                <div id="floating-portal" ref={floatingPortalRef}></div>
            </WindowsContainerContext.Provider>
        </div>
    )
}

export function WindowsLayout({ children, direction="row", growthFactor=1, className="", ...props}) {
    // available directions: row, column

    
    return (
        <div className={`windows-layout ${direction === "row" ? "d-row" : "d-column"} ${className}`} style={{flexGrow: growthFactor}}>
            {children}
        </div>
    )
}


export function Window({ children, growthFactor=1, className="", ...props}) {
    const context = useWindowsContainerContext();

    const windowRef = useRef(null);

    useEffect(() => {
        if (!context.windows.includes(windowRef)) {
            context.windows.push(windowRef);
        }
        // console.log("context:", context);

        return () => {
            const index = context.windows.indexOf(windowRef);
            if (index > -1) { // only splice array when item is found
                context.windows.splice(index, 1);
            }
        }
        
    }, []);


    return (
        <div className={`window ${className}`} style={{flexGrow: growthFactor}} ref={windowRef}>
            {children}
        </div>
    )
};

export function WindowHeader({ children, className="", ...props}) {

    return (
        <div className={`window-header ${className}`}>
            {children}
        </div>
    )
}


export function WindowContent({ children, className="", ...props}) {

    return (
        <div className={`window-content ${className}`}>
            {children}
        </div>
    )
}

