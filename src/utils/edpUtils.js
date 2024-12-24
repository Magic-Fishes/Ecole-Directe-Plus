import CryptoJS from 'crypto-js';

import { KEY, LocalStorageNames } from "./constants"

export function encrypt(chain) {
    if (!chain) {
        return chain
    }
    return CryptoJS.AES.encrypt(chain, KEY).toString()
}

export function decrypt(chain) {
    if (!chain) {
        return chain
    }
    return CryptoJS.AES.decrypt(chain, KEY).toString(CryptoJS.enc.Utf8)
}

export function getInitialEcoleDirecteSessions() {
    const credentials = JSON.parse(decrypt(localStorage.getItem(LocalStorageNames.ENCRYPTED_CREDENTIALS)));
    const token = localStorage.getItem(LocalStorageNames.TOKEN);
    const users = localStorage.getItem(LocalStorageNames.USERS);
    const selectedUserIndex = localStorage.getItem(LocalStorageNames.LAST_SELECTED_USER);


    return {
        Account: {
            username: credentials?.username ? credentials.username : "",
            password: credentials?.password ? credentials.password : "",
            token: token ? token : "",
            users: users ? JSON.parse(users) : null,
            selectedUserIndex: selectedUserIndex ? parseInt(selectedUserIndex) : 0,
        }
    }
}