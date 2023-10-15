import CryptoJS from 'crypto-js';

const key = "THIS_IS_A_PLACEHOLDER_FOR_YOUR_OWN_SECURITY" // Replace this key with a string of your choice

export function areOccurenciesEqual(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
        return obj1 === obj2;
    }
    if (obj1?.length !== obj2?.length) {
        return false;
    }
    for (const i in obj1) {
        if (obj2.hasOwnProperty(i)) {
            if (!areOccurenciesEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
    }
    return true;
}

export function getCurrentSchoolYear() {
    /**
     * return an array:
     * 0: start year bound
     * 1: end year bound
     */
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    if (month >= 8) {
        return [year, (year + 1)];
    }
    
    return [(year - 1), year];
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function encrypt(chain) {
    if (!chain) {
        return chain
    }
    return  CryptoJS.AES.encrypt(chain, key).toString()
}

export function decrypt(chain) {
    if (!chain) {
        return chain
    }
    return CryptoJS.AES.decrypt(chain, key).toString(CryptoJS.enc.Utf8)
}

export function decodeBase64(string) {
    const decodedText = atob(string);

    const bytes = new Uint8Array(decodedText.length);
    for (let i = 0; i < decodedText.length; i++) {
        bytes[i] = decodedText.charCodeAt(i);
    }

    const textDecoder = new TextDecoder('utf-8');
    const output = textDecoder.decode(bytes);

    return output;
}
