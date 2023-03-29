import { getEnv } from 'config';
import createEndpoint, { ApiConfigs } from 'utils/fetch';

const BASE_URL = getEnv('SHAZAM_API_BASE_URL')

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
      GET: createEndpoint<URLParameters, URLParams, string, ResponseBody>('GET', (parameters) => `${BASE_URL}/author/${parameters.autohorId}/details`)
    }
  }
} satisfies ApiConfigs;