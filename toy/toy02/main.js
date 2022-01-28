import { Component, createElement, render } from './toy-react'

class MyComponent extends Component {
    constructor() {
        super()
        this.state = {
            a: 1,
            b: 2
        }
    }

    render() {
        return <div>
            <h1>my component</h1>
            {/* <button onClick={()=> { this.state.a++; this.rerender(); }}>increase</button> */}
            <button onClick={() => { this.setState({ a: this.state.a + 1 }) }}>increase</button>
            <div>
                <span>{this.state.a.toString()}</span>,
                <span>{this.state.b}</span>
            </div>
            {this.children}
        </div>
    }
}

// 2)
render(<MyComponent id="content" class="a">
    <div>a</div>
    <div>b</div>
    <div>c</div>
</MyComponent>, document.body)
