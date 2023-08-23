import Graph from 'graphology';
import React, { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getPageLinks } from '../services/wikiAPIService';
import { MAX_REFRESH_NODES } from '../services/globals';

export const RefreshEdgesComponent: FC<{
  graph: Graph,
  callback: (refreshPromise: Promise<number>, graph: Graph) => void,
  showError: (msg: string) => void,
}> = ({ graph, callback, showError }) => {

  const [show, setShow] = useState(false);

  const handleRefresh = () => {
    if(graph.nodes().length > MAX_REFRESH_NODES) {
      showError(`Cannot refresh graph with more than ${MAX_REFRESH_NODES} nodes`);
      return;
    }

    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    handleClose();
    callback(computeRefresh(), graph);
  };

  const computeRefresh = (): Promise<number> => {
    let nodes = graph.nodes();
    let edgesAdded: number = 0;

    return new Promise<number>((resolve, reject) => {
      if(!nodes || nodes.length < 1) { showError('No graph currently displayed'); reject(); }

      Promise.allSettled(nodes.map(node => getPageLinks(node))).then(results => {
        console.log(`Just requested the Wikipedia API ${results.length} times :(`);
        results.map(result => result.status === 'fulfilled' ? result.value : null).forEach((wikiLinks, i) => {
          if(!wikiLinks) { return; }

          let links = wikiLinks.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

          let newEdges = links.filter(link => nodes.includes(link) && !graph.areNeighbors(nodes[i], link));

          newEdges.forEach(edge => {
            graph.addEdgeWithKey(`${nodes[i]}->${edge}`, nodes[i], edge);
            edgesAdded++;
          });
        });

        resolve(edgesAdded);

      }).catch(err => showError(err));
    });
  };

  return (
    <>
      <button className="btn btn-primary ms-4 rounded-2" onClick={handleRefresh}>Refresh</button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Refreshing the graph sends a lot of traffic to the Wikipedia API, so proceed with caution.</h6>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={handleConfirm}>Confirm Refresh</button>
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};