import { getEnv } from 'config';
//import createEndpoint, { ApiConfigs } from 'utils/fetch';
import { YoutubeSongInfoRequestBody, YoutubeSongInfoResponseBody, YoutubeSongInfoSearchParams } from './shazam.types';
import createYoutubeEndpoint, { ApiConfigs } from 'utils/fetch/youtubeIndex';

const BASE_URL = getEnv('YOUTUBE_V3_BASE_URL')


export const YOUTUBE_API = {
  songName: {
    GET: createYoutubeEndpoint<{}, YoutubeSongInfoSearchParams, YoutubeSongInfoRequestBody, YoutubeSongInfoResponseBody>('GET', () => `${BASE_URL}/search`)
  }
} satisfies ApiConfigs;