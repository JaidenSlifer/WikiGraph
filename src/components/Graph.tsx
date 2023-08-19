import React, { FC, useEffect } from 'react';
import Graph, { DirectedGraph } from 'graphology';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma, useCamera } from '@react-sigma/core';
import { addToNode as _addToNode } from '../services/drawGraphService';
import { getPageLinks } from '../services/wikiAPIService';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';

const GraphComponent: FC<{graph: Graph, drawGraph: (graph: Graph) => void}> = (props) => {
  
  const CreateGraph: FC = () => {
    const loadGraph = useLoadGraph();
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const { gotoNode } = useCamera();
    
    const addToNode = (addToNode: string) => {
      let graph = props.graph;
      let linkList: string[];

      getPageLinks(addToNode)
      .then(links => {
        linkList = links.links.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

        _addToNode(addToNode, linkList, graph);
      
        props.drawGraph(graph);

        gotoNode(addToNode);
      })
      .catch(err => console.error(err));
    };

    // register events loop
    useEffect(() => {
      registerEvents({
        clickNode: event => addToNode(event.node)
      });
    }, [registerEvents]);

    // load graph loop
    useEffect(() => {
      loadGraph(props.graph);
    }, [loadGraph]);

    return null;
  };

  const Force: FC = () => {
    const { start, kill, isRunning } = useWorkerLayoutForce({});

    useEffect(() => {
      start();
      return () => {
        kill();
      };
    }, [start, kill]);

    return null;
  };

  return (
    <SigmaContainer style={{ height: "100%", width: "100%" }}>s
      <CreateGraph />
      <Force />
    </SigmaContainer>
  );
};
  
  export default GraphComponent;