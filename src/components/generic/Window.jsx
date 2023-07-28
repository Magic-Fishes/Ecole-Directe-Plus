
import { useState, useEffect, useRef, createContext, useContext } from "react";

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



export function WindowsContainer({ children, className = "", id = "", animateWindows, allowWindowsManagement, ...props }) {
    const WindowsContainer = useWindowsContainer({ animateWindows, allowWindowsManagement });

    const windowsContainerRef = useRef(null);
    const floatingPortalRef = useRef(null);

    
    function mapSiblings(element, condition=(() => true), siblings=[], knownSiblings=[]) {
        /**
         * This recursive function maps all the sibling elements of the element given in parameter
         * @param element Element around which it looks for siblings
         * @param condition a function that take the element in parameter and return a boolean used to consider or not an element as a sibling
         * @param siblings The already registered siblings
         * @param knownSiblings The already known siblings, here to ensure an ascendant order
         */
        knownSiblings.push(element)
        
        // previous sibling element
        const previousElementSibling = element.previousElementSibling;
        if (previousElementSibling !== null && !knownSiblings.includes(previousElementSibling)) {
            siblings.concat(mapSiblings(previousElementSibling, condition, siblings, knownSiblings));
        }
        
        // current element
        if (condition(element)) {
            siblings.push(element)
        }
        
        // next sibling element
        const nextElementSibling = element.nextElementSibling
        if (nextElementSibling !== null && !knownSiblings.includes(nextElementSibling)) {
            siblings.concat(mapSiblings(nextElementSibling, condition, siblings, knownSiblings));
        }
        
        return siblings;
    }

    
    function mapMoveableElements(targetElement) {
        /**
         * This function maps all the moveable elements around and above the targeted elemented
         * @param targetElement Element around which it looks for moveable elements
        */
        
        const moveableElements = [];
        let currentElement = targetElement;
        
        const isMoveableElement = (element) => {
            // check if the element is moveable and is not the targetElement
            if ((element.classList.contains("window") ||
            element.classList.contains("windows-layout")) &&
            element !== currentElement) {
                return true;
            } else {
                return false;
            }
        }
        
        while (currentElement && currentElement.id !== "windows-container") {
            moveableElements.push([currentElement, mapSiblings(currentElement, isMoveableElement)]);
            currentElement = currentElement.parentElement;
        }
        
        return moveableElements;
    }


    function sortByCSSOrder(elements) {
        return elements.toSorted((elA, elB) => parseInt(elA?.style.order) - parseInt(elB?.style.order));
    }

    
    function sortMoveableElementsByCSSOrder(moveableElements) {
        /**
         * Sort the list by the "order" css property of the elements
         * @param moveableElements Structured data which contains all the relevant moveable elements
         */
        let elementsCopy = [...moveableElements];
        moveableElements.map((item, index) => {
            let array = sortByCSSOrder(item[1]);
            elementsCopy[index][1] = array;
        })
        
        return elementsCopy;
    }


    function orderChildrenInDOM(flexContainer, reset=false) {
        /**
         * Add an "order" css property to each child of the flexContainer
         * @param flexContainer Parent element with a display flex
         * @param reset a boolean which control weather it resets the "order" css property of the elements according to their order in the DOM
         */
        let index = 1;
        for (let window of flexContainer.children) {
            if (reset || window.style.order === "") {
                window.style.order = index;
            }
            index += 1;
        }
    }


    function orderMoveableElementsInDOM(moveableElements) {
        /**
         * Add an "order" css property to each moveable element
         * @param moveableElements Structured data which contains all the relevant moveable elements
         */
        for (let item of moveableElements.toSpliced(0, 1)) {
            orderChildrenInDOM(item[0]);
        }
    }


    function swapElementsCSSOrder(elementA, elementB) {
        /**
         * Swap the "order" css property of the given elements
         */
        const buffer = elementA.style.order;
        elementA.style.order = elementB.style.order;
        elementB.style.order = buffer;
    }


    function rearrangeWindows(mouse, moveableElements) {
        /**
         * Rearrange the windows by changing the css "order" property according to mouse position and moveableElements position and bounds
         * @param mouse Object that contains x and y position of the mouse in the viewport
         * @param moveableElements Structured data which contains all the relevant moveable elements
         */
        for (let item of moveableElements) {
            const movingElement = item[0];
            const siblingElements = item[1];
            let validTargetElementIdx = -1;
            siblingElements.map((element, index) => {
                const direction = parseInt(movingElement.style.order) - parseInt(element.style.order);
                const rect = element.getBoundingClientRect();
                const movingRect = movingElement.getBoundingClientRect()
                let conditionX = false, conditionY = false;
                if (direction > 0) {
                    // movingElement after element
                    // setup the conditions according to the movingElement's width and the targetElement's width
                    if (movingRect.width > rect.width) {
                        conditionX = mouse.x < (rect.x + rect.width);
                    } else {
                        conditionX = mouse.x < (rect.x + movingRect.width);
                    }
    
                    if (movingRect.height > rect.height) {
                        conditionY = mouse.y < (rect.y + rect.height);
                    } else {
                        conditionY = mouse.y < (rect.y + movingRect.height);
                    }
    
                    // evaluate the conditions
                    if (conditionX && conditionY) {
                        if (validTargetElementIdx === -1) {
                            validTargetElementIdx = index;
                        }
                    }
                } else {
                    // movingElement before element
                    // setup the conditions according to the movingElement's height and the targetElement's height
                    if (movingRect.width > rect.width) {
                        conditionX = mouse.x > rect.x;
                    } else {
                        conditionX = mouse.x > (rect.x + rect.width - movingRect.width);
                    }
    
                    if (movingRect.height > rect.height) {
                        conditionY = mouse.y > rect.y;
                    } else {
                        conditionY = mouse.y > (rect.y + rect.height - movingRect.height);
                    }
                    // evaluate the conditions
                    if (conditionX && conditionY) {
                        if (validTargetElementIdx === -1) {
                            validTargetElementIdx = index;
                        }
                    }
                }
            });
            const validTarget = item[1][validTargetElementIdx];
            if (validTarget) {
                console.log("valid swap target:", item[1][validTargetElementIdx]);
                swapElementsCSSOrder(movingElement, validTarget);
                // movingElement.scrollIntoView();
            }
        }
    }
    

    function moveFloatingWindow(mouse, mouseOrigin, windowOrigin, floatingWindow) {
        floatingWindow.style.left = windowOrigin.x + mouse.x - mouseOrigin.x + "px";
        floatingWindow.style.top = windowOrigin.y + mouse.y - mouseOrigin.y + "px";
    }


    function scrollViewport(mouse, scrollableParentElement) {
        if (scrollableParentElement === null) {
            return 0;
        }
        
        const bounds = scrollableParentElement.getBoundingClientRect();

        const SCROLLING_EDGE_SHIFT = 100; // px
        const SCROLLING_SPEED = 3; // px/frame
        
        if (mouse.y < bounds.y + SCROLLING_EDGE_SHIFT) {
            scrollableParentElement.scrollBy(0, -SCROLLING_SPEED);
        } else if (mouse.y > (bounds.y + bounds.height) - SCROLLING_EDGE_SHIFT) {
            scrollableParentElement.scrollBy(0, SCROLLING_SPEED);
        }
        if (mouse.x < bounds.x + SCROLLING_EDGE_SHIFT) {
            scrollableParentElement.scrollBy(-SCROLLING_SPEED, 0);
        } else if (mouse.x > (bounds.x + bounds.width) - SCROLLING_EDGE_SHIFT) {
            scrollableParentElement.scrollBy(SCROLLING_SPEED, 0);
        }

        return 0;
    }
    

    const unfloatWindow = (floatingWindow, targetWindow) => {
        const boundingClientRect = targetWindow.getBoundingClientRect();
        floatingWindow.style.transition = "all 0.4s ease, scale 0.2s ease";
        floatingWindow.style.height = boundingClientRect.height + "px";
        floatingWindow.style.width = boundingClientRect.width + "px";
        floatingWindow.style.left = boundingClientRect.x + "px";
        floatingWindow.style.top = boundingClientRect.y + "px";
        floatingWindow.classList.add("unfloating");
        // floatingWindow.style.scale = 1;
        // floatingWindow.style.cursor = "grab";

        setTimeout(() => {
            // known bug: if the user drop a window and hold another in the next 400ms the overflow will auto
            document.body.style.overflow = "";
            targetWindow.classList.remove("moving")
            floatingWindow.remove()
        }, 400);
    }

    
    function handleMouseDown(event) {
        // prevent from selecting
        // event.preventDefault();
        if (window.getSelection) {
            var selection = window.getSelection();
            selection.removeAllRanges();
        }

        function lookForClosestScrollableParentElement(element) {
            /**
             * Return the closest scrollable parent element.
             * A scrollable element has overflowing content and has the css overflow property set to "auto" or "scroll"
             */
            let currentElement = element.parentElement;
            let currentElementComputedStyle = getComputedStyle(currentElement);
            while (currentElement !== null) {
                
                let contentHeight = currentElement.scrollHeight;
                let divHeight = currentElement.offsetHeight;
                let scrollTop = currentElement.scrollTop;
                let scrollBottom = (contentHeight - divHeight) - scrollTop;
                
                let contentWidth = currentElement.scrollWidth;
                let divWidth = currentElement.offsetWidth;
                let scrollLeft = currentElement.scrollLeft;
                let scrollRight = (contentWidth - divWidth) - scrollLeft;
                
                if ((scrollTop > 0 || scrollBottom > 0 || scrollLeft > 0 || scrollRight > 0) && (currentElementComputedStyle.overflow === "auto" || currentElementComputedStyle.overflow === "scroll")) {
                    // found a scrollable element
                    break;
                }
                currentElement = currentElement.parentElement;
                currentElementComputedStyle = (currentElement !== null) ? getComputedStyle(currentElement) : undefined;
            }

            if (currentElement === null) {
                // the element doesn't have a scrollable element as its parent
                return null;
            }

            return currentElement;
        }
        
        function lookForClosestWindowParent(element) {
            /**
             * Return the closest window parent
             * A window is basically an element with a "window" class (check out the Window component)
             */
            let currentElement = element.parentElement;
            while (!currentElement.classList.contains("window") && currentElement !== null) {
                currentElement = currentElement.parentElement;
            }

            if (currentElement === null) {
                throw new Error("This element: " + element + " doesn't have a window as its parent, although it's supposed to have one.")
            }

            return currentElement;
        }


        const targetWindow = lookForClosestWindowParent(event.target);
        console.log("target:", targetWindow, "| mousedown");
        
        console.log("- - - SCROLLABLE ELEMENTS - - -");
        const scrollableParentElement = lookForClosestScrollableParentElement(targetWindow);
        console.log("scrollableParentElement", scrollableParentElement);

        const floatingWindow = targetWindow.cloneNode(true);
        console.log("floatingWindow:", floatingWindow)


        // mirror the bounds of targetWindow on floatingWindow
        const boundingClientRect = targetWindow.getBoundingClientRect();
        floatingWindow.style.position = "fixed";
        floatingWindow.style.height = boundingClientRect.height + "px";
        floatingWindow.style.width = boundingClientRect.width + "px";
        floatingWindow.style.left = boundingClientRect.x + "px";
        floatingWindow.style.top = boundingClientRect.y + "px";

        // add the floatingWindow to the DOM and change targetWindow style with the "moving" class
        targetWindow.classList.add("moving")
        floatingPortalRef.current.appendChild(floatingWindow);


        // setup dependencies for window reorganization
        let moveableElements = sortMoveableElementsByCSSOrder(mapMoveableElements(targetWindow));
        orderMoveableElementsInDOM(moveableElements);
        console.log("moveableElements:", moveableElements);
        

        const windowOrigin = {
            x: boundingClientRect.x,
            y: boundingClientRect.y
        }

        const mouseOrigin = {
            x: event.clientX,
            y: event.clientY
        }


        let intervalId;
        const handleMouseMove = (event) => {
            event.preventDefault(); // prevent from selecting
            const mouse = {
                x: event.clientX,
                y: event.clientY
            }
            rearrangeWindows(mouse, moveableElements);
            moveFloatingWindow(mouse, mouseOrigin, windowOrigin, floatingWindow);
            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(() => scrollViewport(mouse, scrollableParentElement), 0);
            
        }
        
        const handleMouseUp = () => {
            unfloatWindow(floatingWindow, targetWindow);
            if (intervalId) {
                clearInterval(intervalId);
            }
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    useEffect(() => {
        // windows management
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
            if (WindowsContainer.allowWindowsManagement) {
                header.addEventListener("mousedown", handleMouseDown)
                for (let child of header.children) {
                    // will only happen when css property "pointer-events" is not set to "none"
                    child.addEventListener("mousedown", stopEventPropagation);
                }                
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

    }, []);


    useEffect(() => {
        // windows popping animation
        
        function digChildren(element, action=(() => 0), condition=(() => true), children=[]) {
            /**
             * This recursive function maps all the children elements of the element given in parameter
             * @param element Element around which it looks for children
             * @param action A function that take the element in parameter and which is executed on each child
             * @param condition A function that take the element in parameter and return a boolean used to consider or not an element as a child
             */
            if (element.children.length) {
                for (let child of element.children) {
                    if (condition(child)) {
                        children.push(child);
                    }
                    children.concat(digChildren(child, action, condition, children))
                }
            }
            action(element);
            
            return children
        }

        
        function reflectDOMHierarchy(elements) {
            /**
             * build and return the hierarchy tree
             * the tree is composed of objects that follow this pattern {element: HTMLElement, children: [HTMLElements]}
             */
            let DOMTree = []
            let elementsCopy = [...elements];
            let i = -1;
            // iterate through the array until there is no longer items to place in the tree
            while (elementsCopy.length > 0) {
                i += 1;
                // loop to the start if at the end of the array
                if (i > elementsCopy.length - 1) {
                    i = 0;
                }
                let elementA = elementsCopy[i]
            
                let isContained = false;
                // check if the elementA is contained by another element of the array
                for (let elementB of elementsCopy) {
                    if (elementA !== elementB && elementB.contains(elementA)) {
                        isContained = true;
                    }
                }
                if (!isContained) {
                    // elementA is not contained by any other element of the array: it's a parent element
                    elementsCopy.splice(elementsCopy.indexOf(elementA), 1);
                    
                    // figure out where to place the new parent element
                    let branch = DOMTree;
                    let foundExit = false;
                    while (branch.length > 0 && !foundExit) {
                        foundExit = true;
                        for (let i = 0 ; i < branch.length ; i++) {
                            if (branch[i].element?.contains(elementA)) {
                                branch = branch[i].children;
                                foundExit = false;
                                break;
                            }
                        }
                    }
                    if (branch.length < 1 || foundExit) {
                        branch.push({ element: elementA, children: [] });
                    }
                }
            }
        
            return DOMTree;
        }


        function sortDOMTreeByCSSOrder(DOMTree) {
            if (DOMTree.length > 0) {
                DOMTree.sort((elA, elB) => parseInt(elA?.element.style.order) - parseInt(elB?.element.style.order));
                for (let i = 0 ; i < DOMTree.length ; i++) {
                    sortDOMTreeByCSSOrder(DOMTree[i].children);
                }
            }
        }


        function applyAnimationDelayToWindows(DOMTree, idx=0) {
            const ANIMATION_DELAY_SHIFT = 50; // ms
            DOMTree.map((branch) => {
                if (branch.element.classList.contains("window")) {
                    branch.element.style.animationDelay = (idx)*ANIMATION_DELAY_SHIFT + "ms";
                    idx += 1;
                } else {
                    idx = applyAnimationDelayToWindows(branch.children, idx);
                }
            });
        
            return idx
        }

        
        let children = digChildren(windowsContainerRef.current,
                                   (el) => {
                                       // action
                                       if (el.classList.contains("windows-layout")) {
                                           orderChildrenInDOM(el)
                                       }
                                   },
                                   (el) => {
                                       // condition
                                       return el.classList.contains("windows-layout") || el.classList.contains("window") ? true : false
                                   });

        let DOMTree = reflectDOMHierarchy(children);
        sortDOMTreeByCSSOrder(DOMTree);
        applyAnimationDelayToWindows(DOMTree)
        
    }, [])


    return (
        <div ref={windowsContainerRef} id={`windows-container${(id && " " + id)}`} className={className} {...props}>
            <WindowsContainerContext.Provider value={WindowsContainer}>
                {children}
                <div id="floating-portal" ref={floatingPortalRef}></div>
            </WindowsContainerContext.Provider>
        </div>
    )
}

export function WindowsLayout({ children, direction = "row", growthFactor = 1, className = "", ...props }) {
    // available directions: row, column


    return (
        <div className={`windows-layout ${direction === "row" ? "d-row" : "d-column"} ${className}`} style={{ flexGrow: growthFactor }} {...props}>
            {children}
        </div>
    )
}


export function Window({ children, growthFactor=1, className = "", ...props }) {
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
        <div className={`window ${className}`} style={{ flexGrow: growthFactor }} ref={windowRef} {...props}>
            {children}
        </div>
    )
};

export function WindowHeader({ children, className = "", ...props }) {

    return (
        <div className={`window-header ${className}`} {...props}>
            {children}
        </div>
    )
}


export function WindowContent({ children, className = "", ...props }) {

    return (
        <div className={`window-content ${className}`} {...props}>
            {children}
        </div>
    )
}
