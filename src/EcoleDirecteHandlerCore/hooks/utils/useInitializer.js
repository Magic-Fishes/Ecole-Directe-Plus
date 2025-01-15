import { useState } from "react";

export default function useInitializer(initValue, defaultValue, initializer) { 
    /**
     * This hook works as a usual state except that if the old
     * value is the same as the default value if it changes, it
     * will execute the initializer function.
     * @param initValue is the same as in a useState, the value at declaration
     * @param defaultValue 
     * @param initializer is the callback function that will be called when the state is initialized. It takes 2 arguments :
     *      - newValue : the new value after setting the state.)
     */
    const [state, setState] = useState(initValue);

    return [state, (setter) => {
        setState((oldValue) => {
            const newValue = typeof setter === "function" ? setter(oldValue) : setter; // handle function AND value such as normal state
            if (oldValue === defaultValue && newValue !== defaultValue) { // if the value was the default one and if it changes
                // /!\ note that this will compare reference of object so you will not be able to use empty objects as default values.
                return initializer(newValue);
            } else {
                return newValue;
            }
        })
    }]
}