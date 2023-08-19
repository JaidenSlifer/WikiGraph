export interface  IWikiAPIParams {
  action: string,
	format: 'json',
  formatversion: '2',
	search?: string,
  page?: string,
	profile?: 'engine_autoselect' | 'strict' | 'fuzzy' | 'classic',
  prop?: 'links',
	redirects?: 'resolve' | 'return',
  namespace?: '0',
	limit?: string,
  [key:string]: string | undefined,
}

export interface IWikiLink {
  ns: number,
  title: string,
  exists: boolean,
}

const searchParams: IWikiAPIParams = {
	action: 'opensearch',
	format: 'json',
	search: '',
	profile: 'engine_autoselect',
	redirects: 'resolve',
	formatversion: '2',
  namespace: '0',
  limit: '10',
};

const getParams: IWikiAPIParams = {
	action: 'parse',
	format: 'json',
	page: '',
	prop: 'links',
	formatversion: '2',
}

const baseUrl = 'https://en.wikipedia.org/w/api.php?';

/**
 * Searches the wikipedia API for pages matching the search text
 * @param searchText Text to search for
 * @param params Query parameters
 * @returns A promise that resolves to the json response
 */
export const searchWikiPages = (searchText: string, params?: IWikiAPIParams): Promise<(string | string[])[]> => {
  if (!params) { params = searchParams; }
  if (searchText.length <= 0) { return Promise.reject('Search text must be defined'); }

  params.search = encodeURIComponent(searchText);

  let query = baseUrl;

  for (let key in params) {
    query += key + '=' + params[key] + '&';
  }

  query += 'origin=*';
  
  return fetch(query).then(res => res.json()).catch(err => console.error(err));
}

/**
 * Gets all the links from one wikipedia page
 * @param pageName Page to retrieve links from
 * @param params Query parameters
 * @returns A Promise that resolves to the (partially cleaned) json response
 */
export const getPageLinks = (pageName: string, params?: IWikiAPIParams): Promise<{links: IWikiLink[], pageid: number, title: string}> => {
  if (!params) { params = getParams; }
  if (pageName.length <= 0) { return Promise.reject('Page name must be defined'); }

  params.page = encodeURIComponent(pageName);

  let query = baseUrl;

  for (let key in params) {
    query += key + '=' + params[key] + '&';
  }

  query += 'origin=*';
  
  return fetch(query).then(res => res.json()).then(json => json.parse).catch(err => console.error(err));
}