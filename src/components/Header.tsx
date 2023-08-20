import React, { FC, useState, ChangeEvent, MouseEvent } from "react";
import { searchWikiPages, getPageLinks, IWikiLink } from "../services/wikiAPIService";
import { initGraph } from "../services/drawGraphService";
import Graph from "graphology";
import _ from 'lodash';
import { MAX_SURROUNDING_NODES } from "../services/globals";
import SearchWikiComponent from "./SearchWiki";

const HeaderComponent: FC<{drawGraph: (graph: Graph) => void}> = (props) => {

  const [pageState, setPageState] = useState('');

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageState(event.target.value);
  };

  const handleDrawGraph = (event?: MouseEvent<HTMLButtonElement>, page?: string) => {
    let linkList: string[] = [];
    
    getPageLinks(page ? page : pageState)
    .then(links => {
      linkList = links.links.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

      let sample = _.sampleSize(linkList, MAX_SURROUNDING_NODES);
      
      let graph = initGraph(links.title, sample);

      props.drawGraph(graph);
    })
    .catch(err => console.error(err));
  };
  
  const modalSelectCallback = (page: string) => {
    setPageState(page);
    handleDrawGraph(undefined, page);
  };

  return (
    <div className="input-group">
      <SearchWikiComponent searchText={pageState} modalSelect={modalSelectCallback}/>
      <input type="text" className="form-control" placeholder="Wiki Page" value={pageState} onChange={handlePageChange} autoFocus/>
      <button className="btn btn-primary" onClick={handleDrawGraph}>Draw Graph</button>
    </div>
  );
}

export default HeaderComponent