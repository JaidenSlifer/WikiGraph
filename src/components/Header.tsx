import React, { FC, useState, ChangeEvent } from "react";
import { searchWikiPages, getPageLinks, IWikiLink } from "../services/wikiAPIService";
import { initGraph } from "../services/drawGraphService";
import Graph from "graphology";
import _ from 'lodash';
import { MAX_SURROUNDING_NODES } from "../services/globals";

const HeaderComponent: FC<{drawGraph: (graph: Graph) => void}> = (props) => {

  const [pageState, setPageState] = useState('');

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageState(event.target.value);
  };

  const handleWikiSearch = () => {
    let result = {
      names: [] as string[],
      links: [] as string[],
      searchText: ''
    };

    searchWikiPages(pageState)
    .then(pages => { 
      result.searchText = pages[0] ? pages[0] as string : '';
      result.names = pages[1] ? pages[1] as string[] : [];
      result.links = pages[3] ? pages[3] as string[] : [];
      console.log(result);
    })
    .catch(err => console.error(err));
  };

  const handleDrawGraph = () => {
    let linkList: string[] = [];
    
    getPageLinks(pageState)
    .then(links => {
      linkList = links.links.filter(elem => elem.exists && elem.ns === 0).map(elem => elem.title);

      let sample = _.sampleSize(linkList, MAX_SURROUNDING_NODES);
      
      let graph = initGraph(pageState, sample);

      props.drawGraph(graph);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="input-group">
      <button className="btn btn-primary" onClick={handleWikiSearch}>Search Wikipedia</button>
      <input type="text" className="form-control" placeholder="Wiki Page" value={pageState} onChange={handlePageChange} autoFocus/>
      <button className="btn btn-primary" onClick={handleDrawGraph}>Draw Graph</button>
    </div>
  );
}

export default HeaderComponent