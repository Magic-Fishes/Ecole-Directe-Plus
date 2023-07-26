// c'est le code pour réorganiser les fenêtres et l'animation du début
// c'est ce qu'il faudra convertir to React


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


function mapMovableElements(targetElement) {
    /**
     * This function maps all the movable elements around and above the targeted elemented
     * @param targetElement Element around which it looks for movable elements
    */
    
    movableElements = [];
    let bufferElement = targetElement;
    
    const isMovableElement = (element) => {
        // check if the element is movable and is not the targetElement
        if ((element.classList.contains("window") ||
        element.classList.contains("windows-layout")) &&
        element !== bufferElement) {
            return true;
        } else {
            return false;
        }
    }
    
    while (bufferElement && bufferElement.id !== "windows-container") {
        movableElements.push([bufferElement, mapSiblings(bufferElement, isMovableElement)]);
        bufferElement = bufferElement.parentElement;
    }
    
    return movableElements;
}


function orderChildren(flexContainer, reset=false) {
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


function orderMovableElements(movableElements) {
    /**
     * Add an "order" css property to each movable element
     * @param movableElements Structured data which contains all the relevant movable elements
     */
    for (let item of movableElements.toSpliced(0, 1)) {
        orderChildren(item[0]);
    }
}


function sortByOrder(elements) {
    return elements.toSorted((elA, elB) => parseInt(elA?.style.order) - parseInt(elB?.style.order));
}


function sortMovableElementsByOrder(movableElements) {
    /**
     * Sort the list by the "order" css property of the elements
     * @param movableElements Structured data which contains all the relevant movable elements
     */
    let elementsCopy = [...movableElements];
    movableElements.map((item, index) => {
        let array = sortByOrder(item[1]);
        elementsCopy[index][1] = array;
    })
    
    return elementsCopy;
}


function moveFloatingWindow(event, mouseOrigin, windowOrigin, floatingWindow) {
    floatingWindow.style.left = windowOrigin.x + event.clientX - mouseOrigin.x + "px";
    floatingWindow.style.top = windowOrigin.y + event.clientY - mouseOrigin.y + "px";
}


function swapElementsOrder(elementA, elementB) {
    /**
     * Swap the "order" css property of the given elements
     */
    const buffer = elementA.style.order
    elementA.style.order = elementB.style.order;
    elementB.style.order = buffer;

}


function organizeWindows(event, movableElements) {
    // console.log(movableElements)
    for (let item of movableElements) {
        const movingElement = item[0];
        const siblingElements = item[1];
        let validTargetElementIdx = -1;
        siblingElements.map((element, index) => {
            const direction = parseInt(movingElement.style.order) - parseInt(element.style.order);
            const rect = element.getBoundingClientRect();
            const movingRect = movingElement.getBoundingClientRect()
            // console.log(movingRect)
            const mouse = {x: event.clientX, y: event.clientY}
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
            swapElementsOrder(movingElement, validTarget);
        }
    }
}


const unfloatWindow = (floatingWindow, window) => {
    const boundingClientRect = window.getBoundingClientRect();
    floatingWindow.style.transition = "all 0.4s ease, scale 0.2s ease";
    floatingWindow.style.height = boundingClientRect.height + "px";
    floatingWindow.style.width = boundingClientRect.width + "px";
    floatingWindow.style.left = boundingClientRect.x + "px";
    floatingWindow.style.top = boundingClientRect.y + "px";
    floatingWindow.style.scale = 1;
    
    setTimeout(() => {
        document.body.style.overflow = "";
        window.classList.remove("moving")
        floatingWindow.remove()
    }, 400);
}


const handleMouseDown = (event) => {
    event.preventDefault() // prevent from selecting
    document.body.style.overflow = "hidden"; // prevent from scrolling
    
    const window = event.target.parentElement;
    console.log("target window:", window)

    let movableElements = sortMovableElementsByOrder(mapMovableElements(window));
    orderMovableElements(movableElements);
    console.log("initial movableElements:", movableElements)

    const floatingWindow = window.cloneNode(deep=true)
    
    const boundingClientRect = window.getBoundingClientRect();
    floatingWindow.style.position = "absolute";
    floatingWindow.style.height = boundingClientRect.height + "px";
    floatingWindow.style.width = boundingClientRect.width + "px";
    floatingWindow.style.left = boundingClientRect.x + "px";
    floatingWindow.style.top = boundingClientRect.y + "px";

    window.classList.add("moving");
    floatingPortal.appendChild(floatingWindow);


    const windowOrigin = {
        x: boundingClientRect.x,
        y: boundingClientRect.y
    }

    const mouseOrigin = {
        x: event.clientX,
        y: event.clientY
    }
    
    const handleMouseMove = (event) => {
        event.preventDefault() // prevent from selecting
        organizeWindows(event, movableElements);
        moveFloatingWindow(event, mouseOrigin, windowOrigin, floatingWindow);
    }
    const handleMouseUp = () => {
        unfloatWindow(floatingWindow, window);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
}



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
    // build the hierarchy tree
    // the tree is composed of objects that follow this pattern {element: HTMLElement, children: [HTMLElements]}
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


function shuffle(list) {
    function getRandomInt(min, max) {
        return min + Math.floor(Math.random()*(max - min));
    }
    const SHUFFLE_ITERATION = list.length*2;
    for (let i = 0 ; i < SHUFFLE_ITERATION ; i++) {
        randomIdxA = getRandomInt(0, list.length);
        randomIdxB = getRandomInt(0, list.length);
        
        const buffer = list[randomIdxA];
        list[randomIdxA] = list[randomIdxB];
        list[randomIdxB] = buffer;
    }
}


function sortDOMTreeByOrder(DOMTree) {
    if (DOMTree.length > 0) {
        DOMTree.sort((elA, elB) => parseInt(elA?.element.style.order) - parseInt(elB?.element.style.order));
        for (let i = 0 ; i < DOMTree.length ; i++) {
            sortDOMTreeByOrder(DOMTree[i].children);
        }
    }
}


function addAnimationDelayToWindows(DOMTree, idx=0) {
    DOMTree.map((branch) => {
        if (branch.element.classList.contains("window")) {
            branch.element.style.animationDelay = (idx)*50 + "ms";
            idx += 1;
        } else {
            idx = addAnimationDelayToWindows(branch.children, idx);
        }
    });

    return idx
}


// On load animation
// const windowsContainer = document.getElementById("windows-container");
// let children = digChildren(windowsContainer, (el) => {if (el.classList.contains("windows-layout")) { orderChildren(el) }}, (el) => el.classList.contains("windows-layout") || el.classList.contains("window") ? true : false);

// console.log("DOM Hierarchy:");
// let DOMTree = reflectDOMHierarchy(children);
// console.log([...DOMTree]);
// console.log("Sorted DOM Hierarchy:");
// sortDOMTreeByOrder(DOMTree);
// console.log(DOMTree);

// addAnimationDelayToWindows(DOMTree)
// console.log("AnimationDelayAdded");



/* Floating windows management */
console.log("- - - - - - WINDOWS - - - - - -")
const floatingPortal = document.getElementById("floating-portal");

const windowHeaders = document.getElementsByClassName("window-header");
console.log(windowHeaders)
console.log(Array.from(windowHeaders))
console.log([...windowHeaders])
for (let header of windowHeaders) {
    header.addEventListener("mousedown", handleMouseDown)
    console.log("test")
    for (let child of header.children) {
        child.addEventListener("mousedown", (event) => event.stopPropagation())
    }
}
