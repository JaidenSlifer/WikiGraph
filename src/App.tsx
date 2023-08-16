import * as React from 'react';
import logo from './logo.svg';
import GraphComponent from './components/Graph';
import './App.css';
import HeaderComponent from './components/Header';

function App() {
  return (
    <div className="row justify-content-center">
      <div className="mt-2" style={{ height: "5vh", width: "50vw" }}>
        <HeaderComponent />
      </div>
      <div style={{ height: "90vh", width: "100vw" }}>
        <GraphComponent />
      </div>
    </div>
  );
}

export default App;
