import React, { FC, useState, MouseEvent, ChangeEvent } from 'react';
import { searchWikiPages } from '../services/wikiAPIService';
import { Modal } from 'react-bootstrap';

interface ISearchResults {
  names: string[],
  links: string[],
  searchText: string
}

const SearchWikiComponent: FC<{searchText: string, modalSelect: (page: string) => void}> = (props) => {

  const [results, setResults] = useState({} as ISearchResults);
  const [show, setShow] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

  const handleWikiSearch = (event: MouseEvent<HTMLButtonElement>, modal?: boolean) => {
    let result = {} as ISearchResults;

    searchWikiPages(modal ? modalSearchText : props.searchText)
    .then(pages => { 
      result.searchText = pages[0] ? pages[0] as string : '';
      result.names = pages[1] ? pages[1] as string[] : [];
      result.links = pages[3] ? pages[3] as string[] : [];
      setResults(result);
      setModalSearchText(result.searchText);
      setShow(true);
    })
    .catch(err => console.error(err));

  };

  const handlePageSelect = (event: MouseEvent<HTMLAnchorElement>, name: string) => {
    setSelectedPage(name);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedPage('');
  };

  const handleModalSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setModalSearchText(event.target.value);
  };

  const handleConfirm = () => {
    handleClose();
    props.modalSelect(selectedPage);
  };

  return (
    <>
      <button className="btn btn-primary rounded-end-0" onClick={handleWikiSearch}>Search Wikipedia</button>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-2">
            <input className="form-control" type="text" placeholder="Search Wiki" onChange={handleModalSearchChange} value={modalSearchText}/>
            <button className="btn btn-primary" onClick={event => handleWikiSearch(event, true)}>Search</button>
          </div>
          <ul className="list-group list-group-flush">
            {!results.names ? null : results.names.map(name => 
              <a key={name} className={'list-group-item list-group-item-action' + (name === selectedPage ? ' active' : '')} onClick={event => handlePageSelect(event, name)}>{name}</a>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedPage}>Confirm Selection</button>
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SearchWikiComponent