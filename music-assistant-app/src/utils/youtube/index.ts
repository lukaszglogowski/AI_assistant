import { openErrorMessage } from 'components/ModalMessagesTypes/ErrorMessage';
import { ModalSystemContextInt } from 'contexts/ModalSystemContext';
import { YoutubeQueryType, YoutubeSongInfoResponseBody } from 'utils/apis/shazam.types';
import { YOUTUBE_API } from 'utils/apis/youtube-v3';
import { openNewTab } from 'utils/browser';
import { URLString } from 'utils/genericTypes.types';

const BASE_YT = 'https://www.youtube.com'

export function generateYoutubeLink(id: string, type: 'video' | 'channel' | 'playlist'): URLString {
  
  if (type === 'video') return `${BASE_YT}/watch?v=${id}`;
  if (type === 'channel') return `${BASE_YT}/channel/${id}`;
  if (type === 'playlist') return `${BASE_YT}/playlist?list=${id}`;
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


export function getPlaylist(query: string) {
  const f = YOUTUBE_API.searchPlaylist.GET({}, { query: query, type: 'playlist'}, null);
  return f();
}

export function getFirstPlaylist(query: string) {
  return getPlaylist(query).then((res: YoutubeSongInfoResponseBody<'playlist'>) => {
    return res.data.length ? res.data[0] : null
  })
}







export function getGenericYtButtonEventChannel(modalSystem: ModalSystemContextInt | null, channelName: string) {
  return () => {
    getFirstChannel(channelName).then(ch => {
      if (!ch) {throw new Error('Nie znaleziono kanału');}
      openNewTab(generateYoutubeLink(ch.channelId, 'channel'))
    }).catch((err) => {
      openErrorMessage(modalSystem, err.toString());
    });
  }
}


export function getGenericYtButtonEventVideo(modalSystem: ModalSystemContextInt | null, videoName: string) {
  return () => {
    getFirstVideo(videoName).then(vid => {
      if (!vid) {throw new Error('Nie znaleziono wideo');}
      openNewTab(generateYoutubeLink(vid!.videoId, 'video'))
    }).catch((err) => {
        openErrorMessage(modalSystem, err.toString());
    });
  }
}


export function getGenericYtButtonEventPlaylist(modalSystem: ModalSystemContextInt | null, playlistName: string) {
  return () => {
    getFirstPlaylist(playlistName).then(pl => {
      if (!pl) {throw new Error('Nie znaleziono playlisty');}
      openNewTab(generateYoutubeLink(pl.playlistId, 'playlist'))
    }).catch((err) => {
      openErrorMessage(modalSystem, err.toString());
    });
  }
}