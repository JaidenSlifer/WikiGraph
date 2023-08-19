import Graph from "graphology";
import _ from 'lodash';
import { MAX_SURROUNDING_NODES } from "./globals";

/**
 * Initializes the graph with points spread out evenly around the central node
 * @param origin Name of the central node
 * @param links List of links to make into nodes
 * @returns 
 */
export const initGraph = (origin: string, links: string[]): Graph => {
  const graph = new Graph();
  
  graph.addNode(origin, { x: 0, y: 0, label: origin, size: 25 });

  links.forEach((link, index) => {
    let spreadAngle = index * (2*Math.PI / links.length);

    graph.addNode(link, { x: Math.sin(spreadAngle), y: Math.cos(spreadAngle), label: link, size: 10 }); // yes i know trig functions are wrong but this looks better ok :/
    graph.addEdgeWithKey(`${origin}->${link}`, origin, link);
  });
  
  return graph;
};

/**
 * Adds links onto the selected node (mutates graph)
 * @param addToNode Node to add to
 * @param links List of links to make into nodes
 * @param graph Existing graph
 */
export const addToNode = (addToNode: string, links: string[], graph: Graph) => {
  let edges = graph.edges(addToNode);
  let sourceAttr = graph.getNodeAttributes(addToNode);

  // if adding onto an existing node, it should have >=1 edge and less than max
  if (edges.length < 1 || edges.length >= MAX_SURROUNDING_NODES || !sourceAttr) { return; }

  links = _.sampleSize(links, MAX_SURROUNDING_NODES - edges.length);

  let edgeAngles: {edge: string, angle: number}[] = [];
  edges.forEach(edge => {
    let target = edge.replace(addToNode, '').replace('->', '');
    let targetAttr = graph.getNodeAttributes(target);

    let dx = targetAttr.x - sourceAttr.x;
    let dy = targetAttr.y - sourceAttr.y;
    let angle: number = 0;

    if (dx < 0 && dy < 0) {
      angle = Math.atan(dy / dx) * (180 / Math.PI) + 180;
    } else if (dx > 0 && dy < 0) {
      angle = 360 - Math.atan(dy / dx) * (180 / Math.PI) * -1;
    } else if (dx < 0 && dy > 0) {
      angle = 180 - Math.atan(dy / dx) * (180 / Math.PI) * -1;
    } else {
      angle = Math.atan(dy / dx) * (180 / Math.PI);
    }

    edgeAngles.push({edge: target, angle: angle});
  });

  let takenSpace: number;
  let least: number = 360;
  let greatest: number = 0;
  if (edgeAngles.length > 1) {
    edgeAngles.forEach(edgeAngle => {
      if (edgeAngle.angle <= least) { least = edgeAngle.angle; }
      if (edgeAngle.angle >= greatest) { greatest = edgeAngle.angle; }
    });
    takenSpace = greatest - least;
  } else {
    takenSpace = 0;
    least = edgeAngles[0].angle;
    greatest = edgeAngles[0].angle;
  }

  let spacing = (360 - takenSpace) / (links.length + 1);
  
  let angle: number, end: number;
  if (Math.abs(greatest - least) >= 180) {
    angle = least;
    end = greatest;
  } else if (Math.abs(greatest-least) === 0) {
    angle = greatest + 1;
    end = least;
  } else {
    angle = greatest;
    end = least;
  }

  if (angle >= end) { end = 360; }

  let cnt = 0;
  while (angle < end && cnt < links.length) {
    if(graph.hasNode(links[cnt])) {
      // node already exists, so just add edge
      graph.addEdgeWithKey(`${addToNode}->${links[cnt]}`, addToNode, links[cnt]);
    } else {
      graph.addNode(links[cnt], { x: sourceAttr.x + Math.sin(angle), y: sourceAttr.y + Math.cos(angle), label: links[cnt], size: 10 }); 
      graph.addEdgeWithKey(`${addToNode}->${links[cnt]}`, addToNode, links[cnt]);
    }

    // update and check overflow on angle
    if(angle + spacing >= 360) { 
      angle = angle + spacing - 360;
      end = least;
    } else { angle += spacing; }
    cnt += 1;
  }
};