import React, { FC, useState, ChangeEvent, MouseEvent } from "react";
import { searchWikiPages, getPageLinks, IWikiLink } from "../services/wikiAPIService";

const HeaderComponent: FC = () => {

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
    let linkList: IWikiLink[] = [];
    
    getPageLinks('Albert Einstein')
    .then(links => {
      linkList = links.links.filter(elem => elem.exists && elem.ns == 0);
    })
    .catch(err => console.error(err));
  };

  // const test = () => {
  //   getPageLinks('Albert Einstein')
  //   .then(links => {
  //     console.log(links);
  //   })
  //   .catch(err => console.error(err));
  // };

  return (
    <div className="input-group">
      <button className="btn btn-primary" onClick={handleWikiSearch}>Search Wikipedia</button>
      <input type="text" className="form-control" placeholder="Wiki Page" value={pageState} onChange={handlePageChange} autoFocus/>
      <button className="btn btn-primary" onClick={handleDrawGraph}>Draw Graph</button>
      {/* <button className="btn btn-primary" onClick={test}>Test</button> */}
    </div>
  );
}

export default HeaderComponent