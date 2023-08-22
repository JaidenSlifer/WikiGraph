import React, { FC, useState, ChangeEvent, MouseEvent } from "react";
import { getPageLinks } from "../services/wikiAPIService";
import { initGraph } from "../services/drawGraphService";
import Graph from "graphology";
import _ from 'lodash';
import { MAX_SURROUNDING_NODES, setGlobalSurroundingNodes } from "../services/globals";
import SearchWikiComponent from "./SearchWiki";
import { DropdownButton, Dropdown } from "react-bootstrap";

const HeaderComponent: FC<{drawGraph: (graph: Graph) => void, showError: (errMsg: string) => void}> = (props) => {

  const [pageState, setPageState] = useState('');

  // use this state variable only for rendering, use global for any other purposes
  const [maxSurroundingNodes, setMaxSurroundingState] = useState(MAX_SURROUNDING_NODES);

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageState(event.target.value);
  };

  const handleDrawGraph = (event?: MouseEvent<HTMLButtonElement>, page?: string) => {
    let linkList: string[] = [];
    
    getPageLinks(page ? page : pageState)
    .then(links => {
      if(!links) { props.showError(`Page '${page ? page : pageState}' does not exist`); return; }

      linkList = links.links.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

      let sample = _.sampleSize(linkList, MAX_SURROUNDING_NODES);
      
      let graph = initGraph(links.title, sample);

      props.drawGraph(graph);
    })
    .catch(err => props.showError(err));
  };
  
  const modalSelectCallback = (page: string) => {
    setPageState(page);
    handleDrawGraph(undefined, page);
  };

  const handleMaxSurroundingChange = (num: number) => {
    setMaxSurroundingState(num);
    setGlobalSurroundingNodes(num);
  }

  return (
    <div className="input-group">
      <SearchWikiComponent searchText={pageState} modalSelect={modalSelectCallback} showError={props.showError}/>
      <input type="text" className="form-control text-truncate" placeholder="Wiki Page" value={pageState} onChange={handlePageChange} autoFocus/>
      <DropdownButton variant="secondary rounded-0" title={maxSurroundingNodes}>
        {[3, 4, 5, 6, 7, 8].map(num => <Dropdown.Item onClick={() => handleMaxSurroundingChange(num)} key={num}>{num}</Dropdown.Item>)}
      </DropdownButton>
      <button className="btn btn-primary" onClick={handleDrawGraph}>Draw Graph</button>
    </div>
  );
}

export default HeaderComponent