
import { applyZoom, getZoomedBoudingClientRect } from "../../../utils/zoom";
import { cumulativeDistributionFunction } from "../../../utils/math"

import "./HoverFollowDiv.css";

export default function HoverFollowDiv({ children, displayMode, borderRadius=10, className = "", ...props }) {
    function follow(event) {
        if (displayMode !== "quality") {
            return;
        }
        let bentoBox = event.target;
        while (!bentoBox.classList || !bentoBox.classList.contains("bento-card")) {
            bentoBox = bentoBox.parentElement;
        }
        const bentoBoxRect = getZoomedBoudingClientRect(bentoBox.getBoundingClientRect());
        const deltaMouse = { // distance of the mouse from the center
            x: applyZoom(event.clientX ?? event.touches[0].clientX) - (bentoBoxRect.x + bentoBoxRect.width / 2),
            y: applyZoom(event.clientY ?? event.touches[0].clientY) - (bentoBoxRect.y + bentoBoxRect.height / 2),
        }
        /**Little course about Cumulative Distribution Function (CDF)
         * The CDF returns an int between 0 and 1 given by a the cumulative probability for a given x value
         * (go to highschool and/or search for images of CDF it's easier to understand)
         * this functions takes in parameter 3 variables:
         * - x :         classic x as for every function.
         *                  We will use the distance of the mouse from the center of the box.
         *                  => Math.abs(deltaMouse.x)
         * - μ (mu) :    the average of the function (basically the middle and where is positionned the function), 
         *               you can understand this as the position where CDF(x) == 0.5.
         *                  We will use the dimension of the box divided by 4 to get the middle between the box 
         *                  and an edge as the middle of the CDF.
         *                  => bentoBoxRect.width / 4
         * - σ (sigma) : the standard deviation of the function. It will control the width of the function. 
         *               (the lowest it is, the fastest the CDF will grow).
         *                  We will use the width divided by 5,1516 this value allow us to contains 99% of the values 
         *                  between 0 and the width of the box(I have no idea why but trust me 👍)
         */
        const translationX = cumulativeDistributionFunction(Math.abs(deltaMouse.x), bentoBoxRect.width / 4, bentoBoxRect.width / 5.1516);
        const translationY = cumulativeDistributionFunction(Math.abs(deltaMouse.y), bentoBoxRect.height / 4, bentoBoxRect.height / 5.1516);
        bentoBox.style.transform = `translate(${(translationX * 15) * (deltaMouse.x > 0 ? 1 : -1)}px,${(translationY * 15) * (deltaMouse.y > 0 ? 1 : -1)}px)`
    }

    function handleBentoMouseLeave(event) {
        let bentoBox = event.target
        while (!bentoBox.attributes.class || !bentoBox.attributes.class.value.includes("bento-card")) {
            bentoBox = bentoBox.parentElement
        }
        bentoBox.style.transform = "translate(0, 0)";
    }

    return (
        <div className={`hover-follow-div ${className}`} onMouseMove={follow} onMouseLeave={handleBentoMouseLeave} {...props}>
            {children}
        </div>
    )
}
