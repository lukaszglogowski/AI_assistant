import { getEnv } from 'config';
import createEndpoint, { ApiConfigs } from 'utils/fetch';
import { ShazamDetectSongRequestBody, ShazamDetectSongResponseBody, ShazamDetectSongSearchParams, ShazamInfoKeysRequestBody, ShazamInfoKeysResponseBody, ShazamInfoKeysSearchParams, ShazamSongInfoRequestBody, ShazamSongInfoResponseBody, ShazamSongInfoSearchParams } from './shazam.types';

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
  },
  songs: {
    detect: {
      POST: createEndpoint<{}, ShazamDetectSongSearchParams, ShazamDetectSongRequestBody, ShazamDetectSongResponseBody>('POST', () => `${BASE_URL}/songs/v2/detect`)
    },
    details: {
      GET:createEndpoint<{}, ShazamSongInfoSearchParams, ShazamSongInfoRequestBody, ShazamSongInfoResponseBody>('GET', () => `${BASE_URL}/songs/v2/get-details`)
    },
  },
  infoKeys: {
    GET: createEndpoint<{}, ShazamInfoKeysSearchParams, ShazamInfoKeysRequestBody, ShazamInfoKeysResponseBody>('GET', () => `${BASE_URL}/shazam-songs/get-details`)
  }
} satisfies ApiConfigs;