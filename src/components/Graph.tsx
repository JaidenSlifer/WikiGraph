import React, { FC, useEffect, useState } from 'react';
import Graph from 'graphology';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma, useCamera } from '@react-sigma/core';
import { addToNode as _addToNode } from '../services/drawGraphService';
import { getPageLinks } from '../services/wikiAPIService';
import { useWorkerLayoutForce } from '@react-sigma/layout-force';
import { MAX_SURROUNDING_NODES } from '../services/globals';

const GraphComponent: FC<{graph: Graph, drawGraph: (graph: Graph) => void}> = (props) => {
  
  const CreateGraph: FC = () => {
    const loadGraph = useLoadGraph();
    const registerEvents = useRegisterEvents();
    const { gotoNode, reset } = useCamera();
    
    const addToNode = (addToNode: string) => {

      getPageLinks(addToNode).then(wikiLinks => {
        let links = wikiLinks.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

        _addToNode(addToNode, links, props.graph);
      
        props.drawGraph(props.graph);

        gotoNode(addToNode);
      }).catch(err => console.error(err));
    };

    // register events loop
    useEffect(() => {
      registerEvents({
        doubleClickNode: event => { event.preventSigmaDefault(); addToNode(event.node); }
      });
    }, [registerEvents]);

    // load graph loop
    useEffect(() => {
      loadGraph(props.graph);
      if(props.graph.nodes().length === MAX_SURROUNDING_NODES + 1) { reset(); } // graph just initialized
    }, [loadGraph]);

    return null;
  };

  const DragDropForce: FC = () => {
    
    // Force Layout
    const { start, kill, isRunning } = useWorkerLayoutForce({ settings: { attraction: 0.0001, repulsion: 0.01 } });

    useEffect(() => {
      start();
      return () => {
        kill();
      };
    }, [start, kill]);

    // Drag Drop
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    
    useEffect(() => {
      // Register the events
      registerEvents({
        downNode: (e) => {
          setDraggedNode(e.node);
          sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
        },
        mouseup: (e) => {
          if (draggedNode) {
            setDraggedNode(null);
            sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
          }
        },
        mousedown: (e) => {
          // Disable the autoscale at the first down interaction
          if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        },
        mousemove: (e) => {
          if (draggedNode) {
            // Get new position of node
            const pos = sigma.viewportToGraph(e);
            sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
            sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

            // Prevent sigma to move camera:
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
          }
        },
        // touchup: (e) => {
        //   if (draggedNode) {
        //     setDraggedNode(null);
        //     sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        //   }
        // },
        // touchdown: (e) => {
        //   // Disable the autoscale at the first down interaction
        //   if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        // },
        // touchmove: (e) => {
        //   if (draggedNode) {
        //     // Get new position of node
        //     const pos = sigma.viewportToGraph(e);
        //     sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        //     sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        //     // Prevent sigma to move camera:
        //     e.original.preventDefault();
        //     e.original.stopPropagation();
        //   }
        // },
      });
    }, [registerEvents, sigma, draggedNode]);

    return null;
  };

  return (
    <SigmaContainer style={{ height: "100%", width: "100%" }}>
      <CreateGraph />
      <DragDropForce />
    </SigmaContainer>
  );
};
  
  export default GraphComponent;