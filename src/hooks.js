import React, { useState, useEffect } from "react";

export const useSafeState = (oldState) => {
    const [state, changeState] = useState(oldState);
    let isUnMounted = false;

    useEffect(() => {
        return () => {
            isUnMounted = true;
        }
    }, [])
    function callback(newState) {
        !isUnMounted && changeState(newState);
    }
    return [state, callback];
}