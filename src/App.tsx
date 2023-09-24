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

  let [showNotif, setShowNotif] = useState(false);
  let [notifMsg, setNotifMsg] = useState('');

  const drawGraphCallback = (g: Graph) => {
    let graph = Graph.from(g); // give the state a different object ref so it knows to rerender
    setGraph(graph);
  };

  const showErrorCallback = (msg: string) => {
    setErrorMsg(msg);
    setShowError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMsg('');
  };

  const showNotifCallback = (msg: string) => {
    setNotifMsg(msg);
    setShowNotif(true);
  }

  const handleCloseNotif = () => {
    setShowNotif(false);
    setNotifMsg('');
  }
  
  return (
    <>
      <div className="row justify-content-center">
        <div className="mt-2" style={{ height: "5vh", width: "50vw" }}>
          <HeaderComponent graph={graph} drawGraph={drawGraphCallback} showError={showErrorCallback} showNotif={showNotifCallback} />
        </div>
        <div style={{ height: "95vh", width: "100vw" }}>
          <GraphComponent graph={graph} drawGraph={drawGraphCallback}/>
        </div>
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
        <Toast onClose={handleCloseNotif} show={showNotif} delay={3000} bg="success" autohide>
          <Toast.Body>
            <h4 className="text-light">{notifMsg}</h4>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
