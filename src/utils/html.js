
import { decodeBase64 } from "./utils";
import DOMPurify from "dompurify";

// HTML Escape
function decodeHtmlEscaped(html) {
    /**
     * Clear HTML Escaped content
     * @param html The HTML content you want to clear
     */
    let textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
}

// sanitizer
function sanitizeHTML(htmlContent) {
    // prevent XSS breaches
    return DOMPurify.sanitize(htmlContent);
}


// contrasts management
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function linearize(c) {
    let c_lin = c / 255.0;
    return c_lin <= 0.03928 ? c_lin / 12.92 : Math.pow((c_lin + 0.055) / 1.055, 2.4);
}

function luminance(r, g, b) {
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrast(rgb1, rgb2) {
    let lum1 = luminance(...rgb1);
    let lum2 = luminance(...rgb2);
    let brightest = Math.max(lum1, lum2);
    let darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function adjustColor(originalHex, backgroundHex, minContrast) {
    let originalRgb = hexToRgb(originalHex);
    let backgroundRgb = hexToRgb(backgroundHex);
    let currentContrast = contrast(originalRgb, backgroundRgb);

    if (currentContrast >= minContrast) {
        return originalHex; // Already meets the contrast requirement
    }

    const STEP = 1;
    const originalLuminance = luminance(...originalRgb);
    const backgroundLuminance = luminance(...backgroundRgb);
    let increment = originalLuminance < backgroundLuminance ? -STEP : STEP;

    // Adjusting luminance by changing each color component equally
    while (currentContrast < minContrast) {
        originalRgb = originalRgb.map(component => {
            let newComponent = component + increment*(1+component/255);
            return Math.max(0, Math.min(255, newComponent)); // Clamp between 0 and 255
        });

        if ((originalRgb[0] >= 255 && originalRgb[1] >= 255 && originalRgb[2] >= 255) || (originalRgb[0] <= 0 && originalRgb[1] <= 0 && originalRgb[2] <= 0)) {
            increment = -increment;
        }

        currentContrast = contrast(originalRgb, backgroundRgb);
    }

    return rgbToHex(...originalRgb);
}

function isTagAttribute(html, idx) {
    // TODO: check if it is actually an HTML tag (not simple text)
    return true;
}

export function clearHTML(html, backgroundColor) {
    /**
     * Decodes, makes readable, sanitizes and improve contrasts of html content with optional inline style
     * @param html HTML content to clear
     * @param backgroundColor The color of the background on which the text will be displayed. Allow the function to improve constrasts. (RGB format: list)
     */


    let decodedHTML = decodeBase64(html);
    let readableOutput = decodeHtmlEscaped(decodedHTML);
    let safeHTML = sanitizeHTML(readableOutput);

    let output = "";
    if (backgroundColor !== undefined) {
        const REQUIRED_CONTRAST = 4.5; // WCAG minimum for normal text
        const hexBackgroundColor = rgbToHex(...backgroundColor);
        const styleAttribute = 'style="';

        let index;
        while (index !== -1) {
            index = safeHTML.indexOf(styleAttribute);
            if (isTagAttribute(safeHTML, index)) {
                output += safeHTML.slice(0, index + styleAttribute.length);
                safeHTML = safeHTML.slice(index + styleAttribute.length);
                let endIndex = safeHTML.indexOf('"');
                let inlineStyle = safeHTML.slice(0, endIndex).replace(/(:|;)\s+/g, '$1');
                let colorIdx = inlineStyle.indexOf("color:");
                if (colorIdx !== -1) {
                    let textColor;
                    let hexTextColor;
                    if (inlineStyle[colorIdx + "color:".length] === "#") {
                        // hex
                        textColor = inlineStyle.slice(colorIdx + "color:".length, colorIdx + "color:".length + "#RRGGBB".length);
                        hexTextColor = textColor;
                    } else if (inlineStyle.slice(colorIdx + "color:".length, colorIdx + "color:".length + 3) === "rgb") {
                        // rgb
                        textColor = inlineStyle.slice(colorIdx + "color:".length);
                        textColor = textColor.slice(0, textColor.indexOf(")")+1);
                        hexTextColor = rgbToHex(...textColor.slice("rgb(".length, -1).split(",").map((component) => parseInt(component)));
                    } else {
                        continue;
                    }
                    let contrastedTextColor = adjustColor(hexTextColor, hexBackgroundColor, REQUIRED_CONTRAST);
                    let newInlineStyle = inlineStyle.slice(0, colorIdx) + inlineStyle.slice(colorIdx).replace(textColor, contrastedTextColor);
                    output += newInlineStyle;
                    safeHTML = safeHTML.slice(endIndex);
                }
            }
        }
    }
    output += safeHTML;

    return output;
}
