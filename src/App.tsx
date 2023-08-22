import React, { useState } from 'react';
import logo from './logo.svg';
import GraphComponent from './components/Graph';
import './App.css';
import HeaderComponent from './components/Header';
import Graph from 'graphology';
import { Toast, ToastContainer } from 'react-bootstrap';

function App() {
  
  let [graph, setGraph] = useState(new Graph());
  let [showError, setShowError] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');

  const drawGraphCallback = (g: Graph) => {
    let graph = Graph.from(g); // give the state a different object ref so it knows to rerender
    setGraph(graph);
  };

  const showErrorCallback = (errMsg: string) => {
    setErrorMsg(errMsg);
    setShowError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMsg('');
  };
  
  return (
    <div className="row justify-content-center">
      <div className="mt-2" style={{ height: "5vh", width: "50vw" }}>
        <HeaderComponent drawGraph={drawGraphCallback} showError={showErrorCallback}/>
      </div>
      <div style={{ height: "95vh", width: "100vw" }}>
        <GraphComponent graph={graph} drawGraph={drawGraphCallback}/>
      </div>
      <ToastContainer className="p-3" position="bottom-end" style={{ zIndex: 1 }}>
        <Toast onClose={handleCloseError} show={showError} delay={3000} bg="danger" autohide>
          <Toast.Header>
            <h5 className="text-danger me-auto pt-1">Error</h5>
          </Toast.Header>
          <Toast.Body>
            <span className="text-light">{errorMsg}</span>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
