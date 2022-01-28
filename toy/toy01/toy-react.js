/**
 * an implementation of react DOM
 */


class ElementWrapper {
    constructor(type) {
        /**
         * @type {HTMLElement | EventTarget} 
         */
        this.root = document.createElement(type)
    }

    /**
     * 
     * @param {String} name 
     * @param {Object} value 
     */
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }

    appendChild(component) {
        this.root.appendChild(component.root)
    }

}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }

    setAttribute(name, value) {
        this.props[name] = value
    }

    appendChild(component) {
        this.children.push(component)
    }

    // recursive invocation
    get root() {
        if (!this._root) {
            this._root = this.render().root
        }
        return this._root
    }
}

export function createElement(type, attributes, ...children) {
    let ele;

    if (typeof type === 'string') {
        ele = new ElementWrapper(type)
    } else {
        ele = new type;
    }

    for (let attr in attributes) {
        ele.setAttribute(attr, attributes[attr])
    }

    const insertChildren = (children) => {
        for (let child of children) {
            if (child === null) {
                continue
            }

            if (typeof child === 'object' && Array.isArray(child)) {
                insertChildren(child)
                continue
            }

            if (typeof child === 'string'
                || typeof child === 'number'
                || typeof child === 'boolean') {
                child = new TextWrapper(child)
            }

            ele.appendChild(child)
        }
    }

    insertChildren(children)

    return ele;
}

/**
 * support render
 * @param {Component} component 
 * @param {HTMLElement} parentElement 
 */
export function render(component, parentElement) {
    parentElement.appendChild(component.root)
}
