import { useReducer, useState } from "react";

export default function useAccountData() {
    const [selectedUserDataIndex, setSelectedUserDataIndex] = useState(0);
    const [accountData, dispatch] = useReducer((current, { action, params }) => {

        switch (action) {
            case "INITIALIZE":
                {
                    const { userNumber } = params;
                    return Array.from({ length: userNumber }, () => ({}));
                }
            case "RESET":
                {
                    return null;
                }
            case "SET":
                {
                    const next = [...current];
                    const { data, value, userIndex } = params;

                    next[userIndex][data] = value;
                    return next;
                }
        }
    }, null)

    function initialize(userNumber) {
        dispatch({
            action: "INITIALIZE",
            params: { userNumber }
        });
    }

    function reset() {
        dispatch({
            action: "RESET",
            params: {}
        });
    }

    function set(data, value, userIndex = selectedUserDataIndex) {
        /**This si the function you'll mainly use to change and initialize data of an account with mutiple users.
         * Here is an explanations of the params :
         *  @param data      is the "key" of the data, its identifier in the object "userData" returned bah the hook
         *  @param value     is the value you want to assign to the key above
         *  @param userIndex is the index of a specific user, this may be important in cases where you work with
         *                   async threads and you get data for a user after that the sekected user changed.
         */
        if (accountData === null) {
            throw new Error("Cannot set data in uninitialized accountData")
        }
        if (userIndex >= accountData.length) {
            throw new Error("Cannot set data to unexistent user. Invalid userIndex")
        }
        dispatch({
            action: "SET",
            params: { data, value, userIndex }
        });
    }

    return [
        accountData !== null ? accountData[selectedUserDataIndex] : null,
        {
            set,
            initialize,
            reset,
            setSelectedUserDataIndex
        },
        accountData
    ];
}