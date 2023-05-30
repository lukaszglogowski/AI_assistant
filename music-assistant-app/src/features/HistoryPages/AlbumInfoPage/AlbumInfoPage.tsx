import React, { useContext, useEffect } from 'react';

import styles from './AlbumInfoPage.module.scss';
import { useQuery } from 'react-query';
import { SHAZAM_API, checkForErrors } from 'utils/apis/shazam';
import { ErrorMessage } from 'components/ErrorMesasge';
import { formatDate, generateImgLinkFromShazam } from 'utils/browser';
import { SongRow, songDataToSongRowProps } from '../components/SongRow';
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import ModalSystemContext from 'contexts/ModalSystemContext';
import { getGenericYtButtonEventPlaylist, getGenericYtButtonEventVideo } from 'utils/youtube';
import { Divider } from 'components/Divider';
import { YtButton } from '../components/YtButton';
import { IconButton } from 'components/IconButton';
import { Button } from 'components/Button';
import { AuthorInfoPage } from '../AuthorInfoPage';
import { SongInfoPageWithId } from '../SongInfoPageWithId';
import { ShazamAlbumInfoResponseBody } from 'utils/apis/shazam.types';

export type AlbumInfoPageProps = {
  id: string
};

export const AlbumInfoPage = (props: AlbumInfoPageProps) => {

  const historyRendererContext = useContext(HistoryRendererManipulationContext);
  const historyContext = useContext(HistoryManipulationContext)
  const modalSystem = useContext(ModalSystemContext)

  const { status: albumDetailsSummaryStatus, data: albumDetailsSummaryData } = useQuery({
    queryKey: ['album-details-summary', props.id],
    queryFn: SHAZAM_API.albums.details.GET({}, { id: props.id}, null),
  });
  
  useEffect(() => {
    if (albumDetailsSummaryStatus === 'loading') {
      historyRendererContext.showLoadingSpinner(true);
    } else {
      historyRendererContext.showLoadingSpinner(false);
    }
  }, [albumDetailsSummaryStatus]);

  useEffect(() => {
    if (!!albumDetailsSummaryData) {
      historyRendererContext.updateHistoryTitle('Album');
    } else {
      historyRendererContext.updateHistoryTitle('');
    }
  }, [albumDetailsSummaryData])

  const data = albumDetailsSummaryData?.data?.length && albumDetailsSummaryData?.data?.length > 0 ? albumDetailsSummaryData.data[0] : undefined;

  if (!data) {
    return (<ErrorMessage>Nie znaleziono danych</ErrorMessage>);
  }
  
  return (
    <>
      {(albumDetailsSummaryStatus === 'error' || checkForErrors(albumDetailsSummaryData)) && <ErrorMessage>Nie znaleziono danych</ErrorMessage>}
      {albumDetailsSummaryStatus === 'success' && !checkForErrors(albumDetailsSummaryData) && <>
      <div className={styles['container']}>
        <div className={styles['header-container']}>
          <img src={generateImgLinkFromShazam(data.attributes.artwork.url, 256, 256)}/>
          <div className={styles['name-info']}>
            <div className={styles['name']}>{data.attributes.name}</div>
            <div className={styles['additional-info-container']}>
              <div className={styles['author']}>{data.attributes.artistName}</div>
              <div className={styles['genres']}>{data.attributes.genreNames.join(', ')}</div>
            </div>
          </div>
          <div className={styles['yt-artist-btn']}>
            <YtButton onClick={getGenericYtButtonEventPlaylist(modalSystem, data.attributes.name + ' ' + data.attributes.artistName)}/>
          </div>
        </div>
        <div className={styles['buttons']}>
          <span>Przekieruj do:</span>
          <Button onClick={() => {
            historyContext.pushToHistory({
              history: {
                  component: AuthorInfoPage,
                  props: {adamid: data.relationships.artists.data[0].id},
              }
            })
          }}>Autor</Button>
        </div>
        <div className={styles['info']}>
          <div className={styles['release-date']}><strong>Wydano: </strong>{formatDate(data.attributes.releaseDate)}</div>
        </div>
        {
          data.relationships.tracks.data.length > 0 && <div className={styles['songs-container']}>
            <div className={styles['header']}>
              Utwory: {data.attributes.trackCount}
            </div>
            <div className={styles['songs']}>
              {data.relationships.tracks.data.map((v: any, i:any) => {
                return (
                  <SongRow key={i + '_' + v.attributes.name} {...songDataToSongRowProps(
                    v.attributes,
                    {
                      onYtClick: getGenericYtButtonEventVideo(modalSystem, v.attributes.name + ' ' + v.attributes.artistName),
                      onRowClick: () => {
                        historyContext.pushToHistory({
                          history: {
                            component: SongInfoPageWithId,
                            props: {
                              //songKey: "157666207",
                              id: v.id
                            },
                          },
                        });
                      }
                    },{}
                  )}/>
                );
              })}
            </div>
          </div>
        }
      </div>
      </>}
    </>
  );
}

AlbumInfoPage.defaultProps = {

};

export default AlbumInfoPage;


/*const albumDetailsSummaryData = {
  "data": [
      {
          "id": "1665303573",
          "type": "albums",
          "attributes": {
              "copyright": "℗ 2023 Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "releaseDate": "2023-03-24",
              "upc": "196589557414",
              "isMasteredForItunes": true,
              "artwork": {
                  "width": 3000,
                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                  "height": 3000,
                  "textColor3": "3f3834",
                  "textColor2": "2b2f30",
                  "textColor4": "545755",
                  "textColor1": "110807",
                  "bgColor": "f8f9e9",
                  "hasP3": false
              },
              "url": "https://music.apple.com/us/album/the-dark-side-of-the-moon-live-at-wembley-1974-remastered/1665303573",
              "playParams": {
                  "id": "1665303573",
                  "kind": "album"
              },
              "recordLabel": "Legacy Recordings",
              "isCompilation": false,
              "trackCount": 10,
              "isPrerelease": false,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "isSingle": false,
              "name": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
              "artistName": "Pink Floyd",
              "contentRating": "explicit",
              "isComplete": true
          },
          "relationships": {
              "artists": {
                  "data": [
                      {
                          "id": "487143",
                          "type": "artists"
                      }
                  ]
              },
              "tracks": {
                  "data": [
                      {
                          "id": "1665303580",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": false,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 1,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 165080,
                              "isVocalAttenuationAllowed": false,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200001",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "composerName": "Nick Mason",
                              "audioLocale": "en-US",
                              "url": "https://music.apple.com/us/album/speak-to-me-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665303580",
                              "playParams": {
                                  "id": "1665303580",
                                  "kind": "song"
                              },
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Speak to Me (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/14/6a/d7/146ad73b-1788-1f8e-da0c-01fe33fb8e9b/mzaf_9805632629216961331.plus.aac.ep.m4a"
                                  }
                              ],
                              "contentRating": "explicit",
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665303585",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": true,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 2,
                              "releaseDate": "1973-03-01",
                              "durationInMillis": 170987,
                              "isVocalAttenuationAllowed": true,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200002",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "en-US",
                              "composerName": "Roger Waters, David Gilmour & Richard Wright",
                              "playParams": {
                                  "id": "1665303585",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/breathe-in-the-air-live-at-the-empire-pool-wembley/1665303573?i=1665303585",
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Breathe (In the Air) [Live at the Empire Pool, Wembley, London, 1974]",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/4c/3e/1a/4c3e1abe-7dcc-bcb1-c5fc-2290638a96b3/mzaf_12787430973703310026.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304006",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": false,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 3,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 308720,
                              "isVocalAttenuationAllowed": false,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200003",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "zxx",
                              "composerName": "David Gilmour & Roger Waters",
                              "playParams": {
                                  "id": "1665304006",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/on-the-run-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304006",
                              "discNumber": 1,
                              "hasLyrics": false,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "On the Run (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/c7/3e/e0/c73ee023-5b07-1f8f-70fd-c0fcb7b67aa8/mzaf_12991873401903851841.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304009",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": true,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 4,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 391533,
                              "isVocalAttenuationAllowed": true,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200004",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "composerName": "Roger Waters, David Gilmour, Nick Mason & Richard Wright",
                              "audioLocale": "en-US",
                              "url": "https://music.apple.com/us/album/time-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304009",
                              "playParams": {
                                  "id": "1665304009",
                                  "kind": "song"
                              },
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Time (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/cc/c9/1d/ccc91df3-419d-3e77-4fc6-072d2145ed19/mzaf_14174187894933924141.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304014",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": false,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 5,
                              "releaseDate": "1973-03-01",
                              "durationInMillis": 410053,
                              "isVocalAttenuationAllowed": false,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200005",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "en-US",
                              "composerName": "Richard Wright & Clare Torry",
                              "playParams": {
                                  "id": "1665304014",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/the-great-gig-in-the-sky-live-at-the-empire/1665303573?i=1665304014",
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "The Great Gig In the Sky (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/9a/a9/38/9aa938aa-7b73-a68e-8bf0-27210e021fca/mzaf_15006107185070540389.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304016",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": true,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 6,
                              "releaseDate": "1973-03-01",
                              "durationInMillis": 521000,
                              "isVocalAttenuationAllowed": true,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200006",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "composerName": "Roger Waters",
                              "audioLocale": "en-US",
                              "url": "https://music.apple.com/us/album/money-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304016",
                              "playParams": {
                                  "id": "1665304016",
                                  "kind": "song"
                              },
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Money (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/0c/c0/6f/0cc06f60-43b0-9e21-ccdc-1dd72c0d33e5/mzaf_6064156767691460102.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304020",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": false,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 7,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 489667,
                              "isVocalAttenuationAllowed": false,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200007",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "en-US",
                              "composerName": "Roger Waters & Richard Wright",
                              "playParams": {
                                  "id": "1665304020",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/us-and-them-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304020",
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Us and Them (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/59/b6/2b/59b62bbc-642b-e86b-24b4-105c5d8f6a6f/mzaf_13156168365980446173.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304021",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": false,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 8,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 490853,
                              "isVocalAttenuationAllowed": false,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200008",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "zxx",
                              "composerName": "David Gilmour, Nick Mason & Richard Wright",
                              "playParams": {
                                  "id": "1665304021",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/any-colour-you-like-live-at-the-empire-pool-wembley/1665303573?i=1665304021",
                              "discNumber": 1,
                              "hasLyrics": false,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Any Colour You Like (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/7b/ef/e2/7befe243-a1b4-f47b-833c-37bd05c9edfe/mzaf_91764557418826073.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304023",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": true,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 9,
                              "releaseDate": "1973-03-01",
                              "durationInMillis": 223787,
                              "isVocalAttenuationAllowed": true,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200009",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "composerName": "Roger Waters",
                              "audioLocale": "en-US",
                              "url": "https://music.apple.com/us/album/brain-damage-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304023",
                              "playParams": {
                                  "id": "1665304023",
                                  "kind": "song"
                              },
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Brain Damage (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/e0/46/51/e046510a-49b6-1cfd-dc09-d6e7287edb7f/mzaf_10786517462726929353.plus.aac.ep.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      },
                      {
                          "id": "1665304024",
                          "type": "songs",
                          "attributes": {
                              "hasTimeSyncedLyrics": true,
                              "albumName": "The Dark Side of the Moon: Live at Wembley 1974 (Remastered)",
                              "genreNames": [
                                  "Rock",
                                  "Music"
                              ],
                              "trackNumber": 10,
                              "releaseDate": "2023-03-24",
                              "durationInMillis": 135240,
                              "isVocalAttenuationAllowed": true,
                              "isMasteredForItunes": true,
                              "isrc": "GBN9Y2200010",
                              "artwork": {
                                  "width": 3000,
                                  "url": "https://is4-ssl.mzstatic.com/image/thumb/Music113/v4/1c/9b/26/1c9b263e-5809-28f2-58dc-978476f0e532/196589557414.jpg/{w}x{h}bb.jpg",
                                  "height": 3000,
                                  "textColor3": "3f3834",
                                  "textColor2": "2b2f30",
                                  "textColor4": "545755",
                                  "textColor1": "110807",
                                  "bgColor": "f8f9e9",
                                  "hasP3": false
                              },
                              "audioLocale": "en-US",
                              "composerName": "Roger Waters",
                              "playParams": {
                                  "id": "1665304024",
                                  "kind": "song"
                              },
                              "url": "https://music.apple.com/us/album/eclipse-live-at-the-empire-pool-wembley-london-1974/1665303573?i=1665304024",
                              "discNumber": 1,
                              "hasLyrics": true,
                              "isAppleDigitalMaster": true,
                              "audioTraits": [
                                  "hi-res-lossless",
                                  "lossless",
                                  "lossy-stereo"
                              ],
                              "name": "Eclipse (Live at the Empire Pool, Wembley, London, 1974)",
                              "previews": [
                                  {
                                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/96/f9/c5/96f9c51d-d2e5-20cc-4a6a-195f52b1e0b6/mzaf_4140568060684472703.plus.aac.p.m4a"
                                  }
                              ],
                              "artistName": "Pink Floyd"
                          }
                      }
                  ]
              }
          }
      }
  ]
}*/
