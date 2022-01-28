import React, { useContext } from "react";
import { ValueContext } from "../context/valueProvider";

// consume context

export function ValueComponent1() {
    // the first way to consume - hook useContext

    const value = useContext(ValueContext);

    return <span>{value}</span>;
}

export function ValueComponent2() {
    // the second way to consume - Consumer
    return (
        <ValueContext.Consumer>
            {value => <span>{value}</span>}
        </ValueContext.Consumer>
    );
}