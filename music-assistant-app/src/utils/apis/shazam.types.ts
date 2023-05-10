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

type ShareObject = {
  href?: URLString;
  avatar?: URLString;
  subject: string;
  text: string;
  image: URLString;
  twitter: string
  html: URLString;
  snapchat: URLString;
};

type ArtworkObject = {
  width: number;
  url: URLString;
  height: number;
  textColor3: string;
  textColor2: string;
  textColor4: string;
  textColor1: string;
  bgColor: string;
  hasP3: boolean;
}

type ImagesObject = {
  artistAvatar: URLString;
  coverArt: URLString;
  coverArtHq: URLString;
  joecolor?: string;
};


type ArtistSearchObject = {
  avatar: URLString;
  id: string;
  name: string;
  verified: boolean;
  weburl: URLString;
  adamid: string;
}

type SongSearchObject = {
  layout: string;
  type: string;
  key: string;
  title: string;
  subtitle: string;
  share: ShareObject;
  images: ImagesObject;
  artists: {
    id: string;
    adamid: string;
  }[]
  url: URLString;
}



type SongAttributes = {
  albumName: string;
  hasTimeSyncedLyrics: boolean;
  genreNames: string[];
  trackNumber: number;
  releaseDate: string;
  durationInMillis: number;
  isVocalAttenuationAllowed: boolean,
  isMasteredForItunes: boolean,
  isrc: string;
  artwork: ArtworkObject;
  audioLocale: string;
  composerName: string;
  playParams: {
    id: string;
    kind: string;
  };
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
}


type ArtistAttributes = {
  genreNames: string[];
  name: string;
  artwork: ArtworkObject;
  editorialNotes: {
    name: string;
    standard: string;
    short: string;
  };
  url?: URLString;
}

type AlbumAttributes = {
  copyright: string;
  genreNames: string[];
  releaseDate: string; 
  isMasteredForItunes: boolean;
  upc: string;
  artwork: ArtworkObject;
  url: URLString;
  playParams: {
    id: string;
    kind: string;
  };
  recordLabel: string;
  isCompilation: boolean;
  trackCount: number;
  isPrerelease: string;
  audioTraits: string[];
  isSingle: boolean;
  name: string;
  artistName: string;
  isComplete: boolean;
}



export type ShazamDetectSongSearchParams = {
  timezone?: string;
  identifier?: string;
  timestamp?: string;
  samplems?: string;
  locale?: string;
}

export type ShazamDetectSongRequestBody = string;

export type ShazamDetectSongResponseBody = {
  track: SongSearchObject;
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
          images: ImagesObject;
          share: ShareObject;
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
    attributes: SongAttributes;
    relationships: RelationShipsType<'songs'>;
  }[]
};





export type ShazamSearchSearchParams = {
  locale?: string;
  offset?: string;
  limit?: string;
  term: string;
}

export type ShazamSearchRequestBody = null;

export type ShazamSearchResponseBody = {
  tracks: {
    hits: {
      track: SongSearchObject;
      snippet: string;
    }[]
  };
  artists: {
    hits: {
      artist: ArtistSearchObject
    }[]
  };
}







export type ShazamArtistInfoSearchParams = GenericIdSearchParams & {
  l?: string;
}

export type ShazamArtistInfoRequestBody = null;

export type ShazamArtistInfoResponseBody = {
  data: {
    id: string;
    type: string;
    attributes: ArtistAttributes;
    relationships: {
      albums: {
        data: {
          id: string;
          type: string;
        }[];
      };
    };
  }[]
}


export type ShazamArtistSummaryInfoSearchParams = GenericIdSearchParams & {
  l?: string;
}

export type ShazamArtistSummaryInfoRequestBody = null;

export type ShazamArtistSummaryInfoResponseBody = {
  data: {
    id: string;
    type: string;
  }[]
  resources: {
    artists: {
      [keyId: string]: {
        id: string;
        type: string;
        attributes: ArtistAttributes;
        relationships: {
          albums: {
            data: {
              id: string;
              type: string;
            }[];
          };
        };
        views: {
          'latest-release': {
            attributes: {title: string};
            data: {id: string, type: string}[];
          }
          'tops-songs': {
            attributes: {title: string};
            data: {id: string, type: string}[];
          }
        }
        meta: {
          views: {
            order: string[];
          }
        }
      }
    }
    songs: {
      [keyId: string]: {
        id: string;
        type: string;
        attributes: SongAttributes;
      }
    }
    albums: {
      [keyId: string]: {
        id: string;
        type: string;
        attributes: AlbumAttributes;
      }
    }
  }
}


export type ShazamAlbumInfoSearchParams = GenericIdSearchParams & {
  l?: string;
}

export type ShazamAlbumInfoRequestBody = null;

export type ShazamAlbumInfoResponseBody = {
  data: {
    id: string;
    type: string;
    attributes: AlbumAttributes;
    relationships: {
      artists: {
        data: {
          id: string;
          type: string;
        }[];
      };
      tracks: {
        data: {
          id: string;
          type: string;
          attributes: SongAttributes;
        }[];
      };
    };
  }[];
}






export type YoutubeSongInfoSearchParams = {
  query: string
};

export type YoutubeSongInfoRequestBody = null;

export type YoutubeSongInfoResponseBody = {
  continuation: string;
  estimatedResults: string;
  data: {
    type: string;
    videoId: string;
    title: string;
    channelTitle: string;
    channelId: string;
    description: string;
    viewCount: string;
    publishedText: string;
    lengthText: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    }[];
    richThumbnail: {
      url: string;
      width: number;
      height: number;
    }[];
    channelThumbnail: {
      url: string;
      width: number;
      height: number;
    }[];
  }[];
  msg: string;
  refinements: string[];
};
