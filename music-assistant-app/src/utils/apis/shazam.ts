import createEndpoint, { ApiConfigs } from 'utils/fetch';


type URLParameters = {
  autohorId: string;
}

type URLParams = {
  filter: string;
}

type ResponseBody = {
  status: string
}


export const SHAZAM_API = {
  autors: {
    details: {
      GET: createEndpoint<URLParameters, URLParams, string, ResponseBody>('GET', (parameters) => `http:tozlyurl.com/authors/${parameters.autohorId}/details`)
    }
  }
} satisfies ApiConfigs;