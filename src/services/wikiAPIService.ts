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

const sanitize = (str: string): string => {
  let elem = document.createElement("div");
  elem.innerText = elem.textContent = str;
  str = elem.innerHTML;
  str = str.replace(' ', '_');
  return str;
}

export const searchWikiPages = (searchText: string, params?: IWikiAPIParams): Promise<(string | string[])[]> => {
  if (!params) { params = searchParams; }
  if (searchText.length <= 0) { return Promise.reject('Search text must be defined'); }

  params.search = sanitize(searchText);

  let query = baseUrl;

  for (let key in params) {
    query += key + '=' + params[key] + '&';
  }

  query += 'origin=*';
  
  return fetch(query).then(res => res.json()).catch(err => console.error(err));
}

export const getPageLinks = (pageName: string, params?: IWikiAPIParams): Promise<{links: IWikiLink[], pageid: number, title: string}> => {
  if (!params) { params = getParams; }
  if (pageName.length <= 0) { return Promise.reject('Page name must be defined'); }

  params.page = sanitize(pageName);

  let query = baseUrl;

  for (let key in params) {
    query += key + '=' + params[key] + '&';
  }

  query += 'origin=*';
  
  return fetch(query).then(res => res.json()).then(json => json.parse).catch(err => console.error(err));
}