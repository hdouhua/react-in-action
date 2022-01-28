import React, {createContext} from "react";

// 1) create context
export const ValueContext = createContext('default value')

// 2) provide context
export function ValueProvider(props) {
    const value = props.value || 'context value'

    return (
        <ValueContext.Provider value={value}>
           {props.children}
        </ValueContext.Provider>
    )
}