/**
 * an implementation of react DOM
 */

const RENDER_TO_DOM = Symbol('render to dom')


export class Component {
    constructor(type) {
        this.type = type
        this.props = Object.create(null)
        this.children = []
        this._range = null
    }

    get vdom() {
        return this.render().vdom
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
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }

    /**
     * support re-render
     */
    rerender() {
        let oldRange = this._range

        let range = document.createRange()
        range.setStart(oldRange.startContainer, oldRange.startOffset)
        range.setEnd(oldRange.startContainer, oldRange.startOffset)
        this[RENDER_TO_DOM](range)

        oldRange.setStart(range.endContainer, range.endOffset)
        oldRange.deleteContents()
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

class ElementWrapper extends Component {
    constructor(type) {
        super(type)
        /**
         * @type {HTMLElement | EventTarget} 
         */
        this.root = document.createElement(type)
    }

    get vdom() {
        return {
            type: this.type,
            props: this.props,
            // to vdom array
            children: this.children.map(c => c.vdom)
        }
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

class TextWrapper extends Component {

    constructor(content) {
        super('#text')
        this.content = content
        this.root = document.createTextNode(content)
    }

    get vdom() {
        return {
            type: this.type,
            content: this.content
        }
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
