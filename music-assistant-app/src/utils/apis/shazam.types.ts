import { URLString } from 'utils/genericTypes.types';

const simpleResourceKeys = [
  'artist-highlights', 'track-highlights', 'related-tracks', 'songs',
  'shazam-artists', 'artists', 
] as const

const complexResourceKeys = [
  'shazam-songs', 'lyrics', 'albums' 
] as const

type SimpleResourceType = typeof simpleResourceKeys[number];
type ComplexResourceType = typeof complexResourceKeys[number];

type RelationShipsType<T extends SimpleResourceType | ComplexResourceType> = {
  [relationshipId in Exclude<SimpleResourceType | ComplexResourceType, T>]: {
    data: {
      id: string;
      type: relationshipId
    }[];
  }
}



type GenericIdSearchParams = {
  id: string;
};



export type ShazamDetectSongSearchParams = {
  timezone?: string;
  identifier?: string;
  timestamp?: string;
  samplems?: string;
  locale?: string;
}

export type ShazamDetectSongRequestBody = string;

export type ShazamDetectSongResponseBody = {
  track: {
    key: string;
  }
};




export type ShazamInfoKeysSearchParams = GenericIdSearchParams;

export type ShazamInfoKeysRequestBody = null;

export type ShazamInfoKeysResponseBody = {
  data: {
    id: string;
    type: string;
  }[],
  resources: {
    [simpleKey in SimpleResourceType]: {
      [keyId: string]: {
        id: string;
        type: simpleKey;
      }
    };
  } & {
    albums: {
      [keyId: string]: {
        id: string;
        type: 'albums';
        attributes: {
          artistName: string;
          name: string;
          releaseDate: string;
        }
      }
    }
    lyrics: {
      [keyId: string]: {
        id: string;
        type: 'lyrics';
        attributes: {
          text: string[];
          footer: string;
          musixmatchLyricsId: string;
          providerName: string;
          syncAvailable: boolean;
        }
      }
    }
    'shazam-songs': {
      [keyId: string]: {
        id: string;
        type: 'shazam-songs';
        attributes: {
          type: string;
          title: string;
          artist: string;
          primaryArtist: string;
          label: string;
          explicit: boolean;
          isrc: string;
          webUrl: URLString;
          images: {
            artistAvatar: URLString;
            coverArt: URLString;
            coverArtHq: URLString;
          };
          share: {
            subject: string;
            text: string;
            image: URLString;
            twitter: string
            html: URLString;
            snapchat: URLString;
          };
          genres: {
            primary: string
          };
          streaming: {
            preview: URLString;
            deeplink: URLString;
            store: URLString;
          };
          classicalAvailability: boolean;
        }
        relationships: RelationShipsType<'shazam-songs'>
      }
    }
  }
};






export type ShazamSongInfoSearchParams = GenericIdSearchParams;

export type ShazamSongInfoRequestBody = null;

export type ShazamSongInfoResponseBody = {
  data: {
    id: string;
    type: string;
    attributes: {
      albumName: string;
      hasTimeSyncedLyrics: boolean;
      genreNames: string[];
      trackNumber: number;
      releaseDate: string;
      durationInMillis: number;
      isVocalAttenuationAllowed: boolean,
      isMasteredForItunes: boolean,
      isrc: string;
      artwork: {
        width: number;
        url: URLString;
        height: number;
        textColor3: string;
        textColor2: string;
        textColor4: string;
        textColor1: string;
        bgColor: string;
        hasP3: false
      },
      audioLocale: string;
      composerName: string;
      playParams: {
        id: string;
        kind: string;
      },
      url: URLString;
      discNumber: number;
      hasLyrics: boolean;
      isAppleDigitalMaster: boolean;
      audioTraits: string[];
      name: string;
      previews: {
        url: URLString;
      }[];
      artistName: string;
    };
    relationships: RelationShipsType<'songs'>;
  }[]
};