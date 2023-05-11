import { YoutubeQueryType, YoutubeSongInfoResponseBody } from 'utils/apis/shazam.types';
import { YOUTUBE_API } from 'utils/apis/youtube-v3';
import { URLString } from 'utils/genericTypes.types';

const BASE_YT = 'https://www.youtube.com'

export function generateYoutubeLink(id: string, type: 'video' | 'channel'): URLString {
  
  if (type === 'video') return `${BASE_YT}/watch?v=${id}`
  if (type === 'channel') return `${BASE_YT}/channel/${id}`
  return '';
}




export function getVideo(query: string) {
    const f = YOUTUBE_API.searchVideo.GET({}, { query: query, type: 'video'}, null);
    return f();
}

export function getFirstVideo(query: string) {
  return getVideo(query).then((res: YoutubeSongInfoResponseBody<'video'>) => {
    return res.data.length ? res.data[0] : null
  })
}


export function getChannel(query: string) {
  const f = YOUTUBE_API.searchChannel.GET({}, { query: query, type: 'channel'}, null);
  return f();
}

export function getFirstChannel(query: string) {
  return getChannel(query).then((res: YoutubeSongInfoResponseBody<'channel'>) => {
    return res.data.length ? res.data[0] : null
  })
}