import CryptoJS from 'crypto-js';
import { v5 as uuidv5 } from "uuid";
import sha256 from 'js-sha256';

const key = process.env.ENCRYPTION_KEY || "default_key"; // Use environment variable for security
const UUID_NAMESPACE = "7bbc8dba-be5b-4ff2-b516-713692d5f601";

/**
 * Compares two objects for equality.
 */
export function areOccurenciesEqual(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1 === obj2;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (const key in obj1) {
        if (obj2.hasOwnProperty(key)) {
            if (!areOccurenciesEqual(obj1[key], obj2[key])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}

/**
 * Creates an array of undefined values with the specified length.
 */
export function createUserLists(accountNumber) {
    return Array(accountNumber).fill(undefined);
}

/**
 * Converts a date object to ISO format.
 */
export function getISODate(date) {
    if (typeof date === "string") {
        date = new Date(date);
    }
    return date.getUTCFullYear() +
        "-" +
        (date.getUTCMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getUTCDate().toString().padStart(2, "0");
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Encrypts a string using AES encryption.
 */
export function encrypt(chain) {
    if (!chain) {
        return chain;
    }
    return CryptoJS.AES.encrypt(chain, key).toString();
}

/**
 * Decrypts an AES encrypted string.
 */
export function decrypt(chain) {
    if (!chain) {
        return chain;
    }
    return CryptoJS.AES.decrypt(chain, key).toString(CryptoJS.enc.Utf8);
}

/**
 * Decodes a Base64 encoded string.
 */
export function decodeBase64(string) {
    const decodedText = atob(string);
    const bytes = new Uint8Array(decodedText.length);
    for (let i = 0; i < decodedText.length; i++) {
        bytes[i] = decodedText.charCodeAt(i);
    }
    const textDecoder = new TextDecoder('utf-8');
    return textDecoder.decode(bytes);
}

/**
 * Generates a UUID using a namespace.
 */
export function generateUUID(string) {
    return uuidv5(string, UUID_NAMESPACE);
}

/**
 * Sends data to a webhook.
 */
export function sendToWebhook(targetWebhook, data) {
    let stringifiedData = JSON.stringify(data);
    // prevent data from exceeding 2000 characters
    while (stringifiedData.length > 1900) {
        stringifiedData = stringifiedData.slice(0, stringifiedData.length);
    }
    return fetch(targetWebhook, {
        method: "POST",
        headers: {
            "user-agent": navigator.userAgent,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: stringifiedData })
    });
}

/**
 * Sends JSON data to a webhook in chunks.
 * @param {string} targetWebhook - The URL of the webhook.
 * @param {string} identifier - The identifier for the data.
 * @param {Object} data - The data to send.
 * @param {number} cooldown - The cooldown period.
 * @return {number} The total time taken for all chunks.
 */
export async function sendJsonToWebhook(targetWebhook, identifier, data, cooldown) {
    let stringifiedData = JSON.stringify(data);
    const delay = 2000;
    const chunkSize = 1990;
    setTimeout(() => {
        for (let i = 0; i <= Math.floor(stringifiedData.length / chunkSize); i++) {
            const dataChunk = "# " + i.toString() + "\n" + stringifiedData.slice(chunkSize * i, chunkSize * i + chunkSize);
            setTimeout(() => {
                fetch(targetWebhook, {
                    method: "POST",
                    headers: {
                        "user-agent": navigator.userAgent,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: identifier, content: dataChunk })
                });
            }, i * delay);
        }
    }, cooldown);
    return cooldown + delay * (Math.floor(stringifiedData.length / chunkSize) + 1);
}

/**
 * Detects the browser from the user agent string.
 * @return {string} The name of the browser.
 */
export function getBrowser() {
    const UA = navigator.userAgent;
    if (UA.includes("OPR/") || UA.includes("Opera/")) return "Opera";
    if (UA.includes("Edg/")) return "Edge";
    if (UA.includes("Chrome/")) return "Chrome";
    if (UA.includes("Safari/") && !UA.includes("Chrome/") && !UA.includes("Edg/")) return "Safari";
    if (UA.includes("Firefox/")) return "Firefox";
    if (UA.includes("Qwant/")) return "Qwant";
    if (UA.includes("DuckDuckGo/")) return "DuckDuckGo";
    if (UA.includes("Brave/")) return "Brave";
    if (UA.includes("Vivaldi/")) return "Vivaldi";
    if (UA.includes("SamsungBrowser/")) return "Samsung Internet";
    return "Unknown";
}

/**
 * Detects the OS from the user agent string.
 * @return {string} The name of the OS.
 */
export function getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.includes(platform)) return 'MacOS';
    if (iosPlatforms.includes(platform)) return 'iOS';
    if (windowsPlatforms.includes(platform)) return 'Windows';
    if (/Android/.test(userAgent)) return 'Android';
    if (/Linux/.test(platform)) return 'Linux';
    return 'Unknown';
}

/**
 * Converts a string to an HSL color value.
 */
export function textToHSL(str, initialS = 42, initialL = 73, variationS = 10, variationL = 10) {
    const int = parseInt(sha256(str), 16);
    const l = int % 10000;
    const h = Math.round((int % (10 ** 8)) / (10 ** 4));
    const s = Math.round((int % (10 ** 12)) / (10 ** 8));
    return [360 * (h / 9999), initialS + variationS * (s / 9999), initialL + variationL * (l / 9999)];
}

/**
 * Removes accents from a string.
 */
export function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
