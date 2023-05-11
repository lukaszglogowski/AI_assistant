import { getEnv } from 'config';
//import createEndpoint, { ApiConfigs } from 'utils/fetch';
import { YoutubeSongInfoRequestBody, YoutubeSongInfoResponseBody, YoutubeSongInfoSearchParams } from './shazam.types';
import createYoutubeEndpoint, { ApiConfigs } from 'utils/fetch/youtubeIndex';

const BASE_URL = getEnv('YOUTUBE_V3_BASE_URL')


export const YOUTUBE_API = {
  searchVideo: {
    GET: createYoutubeEndpoint<{}, YoutubeSongInfoSearchParams<'video'>, YoutubeSongInfoRequestBody, YoutubeSongInfoResponseBody<'video'>>('GET', () => `${BASE_URL}/search`)
  },
  searchChannel: {
    GET: createYoutubeEndpoint<{}, YoutubeSongInfoSearchParams<'channel'>, YoutubeSongInfoRequestBody, YoutubeSongInfoResponseBody<'channel'>>('GET', () => `${BASE_URL}/search`)
  }
} satisfies ApiConfigs;