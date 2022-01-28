import { ValueProvider } from './context/valueProvider';
import { ValueComponent1, ValueComponent2 } from './components/valueComponent'
import './App.css';

function App() {
  return (
    <ValueProvider value="good news in mirror">
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <div className="App-container">
          <ValueComponent1 />
          <hr />
          <ValueComponent2 />
        </div>
      </div>
    </ValueProvider>
  );
}

export default App;
