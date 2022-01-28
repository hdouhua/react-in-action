/**
 * an implementation of react DOM
 */

const RENDER_TO_DOM = Symbol('render to dom')


class ElementWrapper {
    constructor(type) {
        /**
         * @type {HTMLElement | EventTarget} 
         */
        this.root = document.createElement(type)
    }

    /**
     * support event listener here
     * @param {String} name 
     * @param {Object} value 
     */
    setAttribute(name, value) {
        // [\s|\S]+ : match all characters
        if (name.match(/^on([\s|\S]+)$/)) {
            // toLowerCase first character
            this.root.addEventListener(RegExp.$1.replace(/^[\s|\S]/, (c) => c.toLowerCase()), value)
        } else {
            this.root.setAttribute(name, value)
        }
    }

    appendChild(component) {
        let range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root, this.root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }

    /**
     * support render
     * @param {Range} range 
     */
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }

}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }

    /**
     * support render
     * @param {Range} range 
     */
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
        this._range = null
    }

    setAttribute(name, value) {
        this.props[name] = value
    }

    appendChild(component) {
        this.children.push(component)
    }

    /**
     * support render
     * @param {Range} range 
     */
    [RENDER_TO_DOM](range) {
        // ?

        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }

    /**
     * support re-render
     */
    rerender() {
        this._range.deleteContents()
        this[RENDER_TO_DOM](this._range)
    }

    /**
     * combine setState & re-render
     * @param {Object} newState 
     */
    setState(newState) {
        if (this.state == null || typeof this.state !== 'object') {
            this.state = newState
            this.rerender()
            return
        }

        // deep copy
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] == null || typeof oldState[p] !== 'object') {
                    oldState[p] = newState[p]
                } else {
                    merge(oldState[p], newState[p])
                }
            }
        }

        merge(this.state, newState)
        this.rerender()
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
    let range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)

    range.deleteContents()
    component[RENDER_TO_DOM](range)
}
