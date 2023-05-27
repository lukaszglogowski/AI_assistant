import { getEnv } from 'config';
import createEndpoint, { ApiConfigs } from 'utils/fetch';
import { ShazamAlbumInfoRequestBody, ShazamAlbumInfoResponseBody, ShazamAlbumInfoSearchParams, ShazamArtistInfoRequestBody, ShazamArtistInfoResponseBody, ShazamArtistInfoSearchParams, ShazamArtistSummaryInfoRequestBody, ShazamArtistSummaryInfoResponseBody, ShazamArtistSummaryInfoSearchParams, ShazamAuthorLatestReleaseInfoRequestBody, ShazamAuthorLatestReleaseInfoResponseBody, ShazamAuthorLatestReleaseInfoSearchParams, ShazamAuthorTopSongsInfoRequestBody, ShazamAuthorTopSongsInfoResponseBody, ShazamAuthorTopSongsInfoSearchParams, ShazamDetectSongRequestBody, ShazamDetectSongResponseBody, ShazamDetectSongSearchParams, ShazamInfoKeysRequestBody, ShazamInfoKeysResponseBody, ShazamInfoKeysSearchParams, ShazamSearchRequestBody, ShazamSearchResponseBody, ShazamSearchSearchParams, ShazamSongInfoRequestBody, ShazamSongInfoResponseBody, ShazamSongInfoSearchParams } from './shazam.types';

const BASE_URL = getEnv('SHAZAM_API_BASE_URL')

export const SHAZAM_API = {
  autors: {
    details: {
      GET: createEndpoint<{}, ShazamArtistInfoSearchParams, ShazamArtistInfoRequestBody, ShazamArtistInfoResponseBody>('GET', () => `${BASE_URL}/artists/get-details`)
    },
    summary: {
      GET: createEndpoint<{}, ShazamArtistSummaryInfoSearchParams, ShazamArtistSummaryInfoRequestBody, ShazamArtistSummaryInfoResponseBody>('GET', () => `${BASE_URL}/artists/get-summary`)
    },
    topSongs: {
      GET: createEndpoint<{}, ShazamAuthorTopSongsInfoSearchParams, ShazamAuthorTopSongsInfoRequestBody, ShazamAuthorTopSongsInfoResponseBody>('GET', () => `${BASE_URL}/artists/get-top-songs`)
    },
    latestRelease: {
      GET: createEndpoint<{}, ShazamAuthorLatestReleaseInfoSearchParams, ShazamAuthorLatestReleaseInfoRequestBody, ShazamAuthorLatestReleaseInfoResponseBody>('GET', () => `${BASE_URL}/artists/get-latest-release`)
    }
  },
  songs: {
    detect: {
      POST: createEndpoint<{}, ShazamDetectSongSearchParams, ShazamDetectSongRequestBody, ShazamDetectSongResponseBody>('POST', () => `${BASE_URL}/songs/v2/detect`)
    },
    details: {
      GET: createEndpoint<{}, ShazamSongInfoSearchParams, ShazamSongInfoRequestBody, ShazamSongInfoResponseBody>('GET', () => `${BASE_URL}/songs/v2/get-details`)
    },
  },
  search: {
    GET: createEndpoint<{}, ShazamSearchSearchParams, ShazamSearchRequestBody, ShazamSearchResponseBody>('GET', () => `${BASE_URL}/search`)
  },
  albums: {
    details: {
      GET: createEndpoint<{}, ShazamAlbumInfoSearchParams, ShazamAlbumInfoRequestBody, ShazamAlbumInfoResponseBody>('GET', () => `${BASE_URL}/albums/get-details`)
    }
  },
  infoKeys: {
    GET: createEndpoint<{}, ShazamInfoKeysSearchParams, ShazamInfoKeysRequestBody, ShazamInfoKeysResponseBody>('GET', () => `${BASE_URL}/shazam-songs/get-details`)
  }
} satisfies ApiConfigs;