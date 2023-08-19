import React, { useState } from 'react';
import logo from './logo.svg';
import GraphComponent from './components/Graph';
import './App.css';
import HeaderComponent from './components/Header';
import Graph from 'graphology';

function App() {
  
  let [graph, setGraph] = useState(new Graph());

  const drawGraphCallback = (g: Graph) => {
    let graph = Graph.from(g); // give the state a different object ref so it knows to rerender
    setGraph(graph);
  };
  
  return (
    <div className="row justify-content-center">
      <div className="mt-2" style={{ height: "5vh", width: "50vw" }}>
        <HeaderComponent drawGraph={drawGraphCallback}/>
      </div>
      <div style={{ height: "95vh", width: "100vw" }}>
        <GraphComponent graph={graph} drawGraph={drawGraphCallback}/>
      </div>
    </div>
  );
}

export default App;
