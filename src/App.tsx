import * as React from 'react';
import logo from './logo.svg';
import GraphComponent from './components/Graph';
import './App.css';

function App() {
  return (
    <div>
      <div style={{ height: "100vh", width: "100vw" }}>
        <GraphComponent />
      </div>
    </div>
  );
}

export default App;
