import { useState } from "react";

export default function useUserData(activeAccount) {
    const [userData, setUserData] = useState([]);

    function getUserData(key) {
        return userData?.[activeAccount]?.[key];
    }

    function updateUserData(key, value) {
        setUserData((oldUserData) => {
            const newUserData = [...oldUserData];
            if (!newUserData[activeAccount]) {
                newUserData[activeAccount] = {};
            }
            newUserData[activeAccount][key] = value;
            return newUserData;
        })
    }

    return [getUserData, updateUserData];
}
