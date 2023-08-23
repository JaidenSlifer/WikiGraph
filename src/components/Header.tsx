import React, { FC, useState, ChangeEvent, MouseEvent } from "react";
import { getPageLinks } from "../services/wikiAPIService";
import { initGraph } from "../services/drawGraphService";
import Graph from "graphology";
import _ from 'lodash';
import { MAX_SURROUNDING_NODES, setGlobalSurroundingNodes } from "../services/globals";
import SearchWikiComponent from "./SearchWiki";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { RefreshEdgesComponent } from "./RefreshEdges";

const HeaderComponent: FC<{
  graph: Graph,
  drawGraph: (graph: Graph) => void,
  showError: (msg: string) => void,
  showNotif: (msg: string) => void,
}> = (props) => {

  const [pageState, setPageState] = useState('');

  // use this state variable only for rendering, use global for any other purposes
  const [maxSurroundingNodes, setMaxSurroundingState] = useState(MAX_SURROUNDING_NODES);

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageState(event.target.value);
  };

  const handleDrawGraph = (event?: MouseEvent<HTMLButtonElement>, page?: string) => {
    
    getPageLinks(page ? page : pageState).then(wikiLinks => {
      if(!wikiLinks) { props.showError(`Page '${page ? page : pageState}' does not exist`); return; }

      let links = wikiLinks.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

      let sample = _.sampleSize(links, MAX_SURROUNDING_NODES);
      
      let graph = initGraph(page ? page : pageState, sample);

      props.drawGraph(graph);
    }).catch(err => props.showError(err));
  };
  
  const modalSelectCallback = (page: string) => {
    setPageState(page);
    handleDrawGraph(undefined, page);
  };

  const handleMaxSurroundingChange = (num: number) => {
    setMaxSurroundingState(num);
    setGlobalSurroundingNodes(num);
  }

  const refreshEdgesCallback = (refreshPromise: Promise<number>, graph: Graph) => {
    refreshPromise.then(edgesAdded => {
      props.showNotif(`${edgesAdded} new edges added!`);
      props.drawGraph(props.graph);
    }).catch(err => props.showError(err));
  }

  return (
    <div className="input-group">
      <SearchWikiComponent searchText={pageState} modalSelect={modalSelectCallback} showError={props.showError}/>
      <input type="text" className="form-control text-truncate" placeholder="Wiki Page" value={pageState} onChange={handlePageChange} autoFocus/>
      <DropdownButton variant="secondary rounded-0" title={maxSurroundingNodes}>
        {[3, 4, 5, 6, 7, 8].map(num => <Dropdown.Item onClick={() => handleMaxSurroundingChange(num)} key={num}>{num}</Dropdown.Item>)}
      </DropdownButton>
      <button className="btn btn-primary rounded-end-2" onClick={handleDrawGraph}>Draw Graph</button>
      <RefreshEdgesComponent graph={props.graph} callback={refreshEdgesCallback} showError={props.showError}/>
    </div>
  );
}

export default HeaderComponent