import { useReducer, useState } from "react";

export default function useAccountData() {
    const [selectedUserDataIndex, setSelectedUserDataIndex] = useState(0);
    const [accountData, dispatch] = useReducer((current, { action, params }) => {
        switch (action) {
            case "INITIALIZE":
                {
                    const { userNumber, dataList } = params;
                    return Array.from({ length: userNumber }, () => (Object.fromEntries(dataList.map((dataName) => [
                        dataName,
                        undefined,
                    ]))));
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
    }, null);

    function initialize(userNumber, dataList) {
        dispatch({
            action: "INITIALIZE",
            params: { userNumber, dataList }
        });
    }

    function reset() {
        dispatch({
            action: "RESET",
            params: {}
        });
    }

    /**This is the function you'll mainly use to change and initialize data of an account with mutiple users.
     * Here is an explanations of the params :
     *  @param data      is the "key" of the data, its identifier in the object "userData" returned bah the hook
     *  @param value     is the value you want to assign to the key above
     *  @param userIndex is the index of a specific user, this may be important in cases where you work with
     *                   async threads and you get data for a user after that the sekected user changed.
     */
    function set(data, value, userIndex) {
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

    const returnedData = accountData !== null 
        ? accountData.map(data => Object.fromEntries(Object.keys(accountData[selectedUserDataIndex]).map((dataName) => [
            dataName,
            {
                value: data[dataName],
                set: (value, userIndex = selectedUserDataIndex) => {
                    set(dataName, value, userIndex);
                },
            }
        ])))
        : null;

    return [
        returnedData !== null
            ? returnedData[selectedUserDataIndex]
            : null,
        {
            initialize,
            reset,
            setSelectedUserDataIndex
        },
        returnedData,
        accountData,
    ];
}