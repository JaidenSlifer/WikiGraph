import React, { FC, useEffect } from 'react';
import Graph from 'graphology';
import { SigmaContainer, useLoadGraph } from '@react-sigma/core';

const GraphComponent: FC = () => {
  const CreateGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
      // Create the graph
      const graph = new Graph();
      graph.addNode('A', { x: 0, y: 0, label: 'Node A', size: 10 });
      graph.addNode('B', { x: 1, y: 1, label: 'Node B', size: 10 });
      graph.addEdgeWithKey('rel1', 'A', 'B', { label: 'REL_1' });
      loadGraph(graph);
    }, [loadGraph]);

    return null;
  };

  return (
    <SigmaContainer style={{ height: "100%", width: "100%" }}>
      <CreateGraph />
    </SigmaContainer>
  );
};
  
  export default GraphComponent;