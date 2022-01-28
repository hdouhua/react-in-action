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
        this._vdom = this.vdom
        this._vdom[RENDER_TO_DOM](range)
    }

    /**
     * similar to re-render
     */
    update() {
        const isSameNode = (oldNode, newNode) => {

            // node type is different
            if (oldNode.type !== newNode.type) {
                return false
            }

            // newNode props less than oldNode's
            if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length) {
                return false
            }

            // special node #text
            if (newNode.type === '#text') {
                if (newNode.content !== oldNode.content) {
                    return false
                }
            }

            // props value changed
            for (let name in newNode.props) {
                if (newNode.props[name] !== oldNode.props[name]) {
                    return false
                }
            }

            return true
        }

        const updateFunc = (oldNode, newNode) => {

            // check type, props, children
            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
            }
            newNode._range = oldNode._range

            // v-children
            let oldChildren = oldNode.vchildren
            let newChildren = newNode.vchildren

            if (!oldChildren || oldChildren.length === 0) {
                return
            }

            /**
            * @type {Range}
            */
            let tailRange = oldChildren[oldChildren.length - 1]._range

            for (let i = 0; i < newChildren.length; i++) {
                let oldChild = oldChildren[i];
                let newChild = newChildren[i];

                if (i < oldChildren.length) {
                    updateFunc(oldChild, newChild)
                } else {
                    /**
                     * @type {Range}
                     */
                    let range = document.createRange()
                    range.setStart(tailRange.endContainer, tailRange.endOffset)
                    range.setEnd(tailRange.endContainer, tailRange.endOffset)
                    newChild[RENDER_TO_DOM](range)
                    tailRange = range
                }
            }

        }

        let vdom = this.vdom
        updateFunc(this._vdom, vdom)
        this._vdom = vdom
    }

    /**
     * combine setState & re-render
     * @param {Object} newState 
     */
    setState(newState) {
        if (this.state == null || typeof this.state !== 'object') {
            this.state = newState
            this.update()
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
        this.update()
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        super(type)
        // /**
        //  * @type {HTMLElement | EventTarget} 
        //  */
        // this.root = document.createElement(type)
    }

    get vdom() {
        this.vchildren = this.children.map(c => c.vdom)
        return this
    }

    /**
     * support render
     * @param {Range} range 
     */
    [RENDER_TO_DOM](range) {
        // replace with replaceContent()
        // range.deleteContents()
        // range.insertNode(this.root)

        this._range = range

        // create new root
        let root = document.createElement(this.type)

        // render props
        /**
         * @type {HTMLElement | EventTarget} 
         */
        for (let name in this.props) {
            // copy code from setAttribute

            let value = this.props[name]
            if (name.match(/^on([\s|\S]+)$/)) {
                root.addEventListener(RegExp.$1.replace(/^[\s|\S]/, (c) => c.toLowerCase()), value)
            } else {
                if (name === 'className') {
                    root.setAttribute('class', value)
                } else {
                    root.setAttribute(name, value)
                }
            }
        }

        // render children (virtual children)
        for (let child of this.vchildren) {
            // copy code from appendChild

            let childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child[RENDER_TO_DOM](childRange)
        }

        replaceContent(range, root)
    }

}

class TextWrapper extends Component {

    constructor(content) {
        super('#text')
        this.content = content
        // replace with replaceContent()
        // this.root = document.createTextNode(content)       
    }

    get vdom() {
        return this
    }

    /**
     * support render
     * @param {Range} range 
     */
    [RENDER_TO_DOM](range) {
        // replace with replaceContent()
        // range.deleteContents()
        // range.insertNode(this.root)

        this._range = range
        let root = document.createTextNode(this.content)
        replaceContent(range, root)
    }
}

/**
 * 
 * @param {Range} range 
 * @param {Node} node 
 */
function replaceContent(range, node) {
    range.insertNode(node)
    range.setStartAfter(node)
    range.deleteContents()

    range.setStartBefore(node)
    range.setEndAfter(node)
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
