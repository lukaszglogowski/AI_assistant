import { ErrorMessage } from 'components/ErrorMesasge';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { SHAZAM_API, checkForErrors } from 'utils/apis/shazam';

import styles from './AuthorInfoPage.module.scss';
import { generateImgLinkFromShazam } from 'utils/browser';
import { AlbumRow, albumDataToAlbumRowProps } from '../components/AlbumRow';
import ModalSystemContext from 'contexts/ModalSystemContext';
import { getGenericYtButtonEventChannel, getGenericYtButtonEventPlaylist, getGenericYtButtonEventVideo } from 'utils/youtube';
import { SongRow, songDataToSongRowProps } from '../components/SongRow';
import { AlbumAttributes, ShazamDetectSongResponseBody, SongAttributes } from 'utils/apis/shazam.types';
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import { AlbumInfoPage } from '../AlbumInfoPage';
import { YtButton } from '../components/YtButton';
import { SongInfoPage } from '../SongInfoPage';
import SongInfoPageWithId from '../SongInfoPageWithId/SongInfoPageWithId';

export type AuthorInfoPageProps = {
  adamid: string;
};

export const AuthorInfoPage = (props: AuthorInfoPageProps) => {

  const historyRendererContext = useContext(HistoryRendererManipulationContext);
  const historyContext = useContext(HistoryManipulationContext)
  const modalSystem = useContext(ModalSystemContext)
  
  const { status: authorDetailsSummaryStatus, data: authorDetailsSummaryData } = useQuery({
    queryKey: ['author-details-summary', props.adamid],
    queryFn: SHAZAM_API.autors.summary.GET({}, { id: props.adamid }, null),
  });

  const { status: authorLatestReleaseStatus, data: authorLatestReleaseData } = useQuery({
    queryKey: ['author-latest-release', props.adamid],
    queryFn: SHAZAM_API.autors.latestRelease.GET({}, { id: props.adamid }, null),
  });

  const { status: authorTopSongsStatus, data: authorTopSongsData } = useQuery({
    queryKey: ['author-top-songs', props.adamid],
    queryFn: SHAZAM_API.autors.topSongs.GET({}, { id: props.adamid }, null),
  });

  useEffect(() => {
    if (authorDetailsSummaryStatus === 'loading' ||
        authorLatestReleaseStatus === 'loading' ||
        authorTopSongsStatus === 'loading') {
      historyRendererContext.showLoadingSpinner(true);
    } else {
      historyRendererContext.showLoadingSpinner(false);
    }
  }, [authorDetailsSummaryStatus, authorLatestReleaseStatus, authorTopSongsStatus]);

  useEffect(() => {
    if (!!authorDetailsSummaryData) {
      historyRendererContext.updateHistoryTitle('Artysta');
    } else {
      historyRendererContext.updateHistoryTitle('');
    }
  }, [authorDetailsSummaryData])

  const id = authorDetailsSummaryData?.data?.length && authorDetailsSummaryData?.data?.length > 0 ? authorDetailsSummaryData.data[0].id : '';
  return (
    <>
      {(authorDetailsSummaryStatus === 'error' || checkForErrors(authorDetailsSummaryData)) && <ErrorMessage>Nie znaleziono danych</ErrorMessage>}
      {authorDetailsSummaryStatus === 'success' && !checkForErrors(authorDetailsSummaryData) && <>
        <div className={styles['container']}>
          <div className={styles['header-container']}>
            <img src={generateImgLinkFromShazam(authorDetailsSummaryData.resources.artists[id].attributes.artwork.url, 256, 256)}/>
            <div className={styles['name-info']}>
              <div className={styles['name']}>{authorDetailsSummaryData.resources.artists[id].attributes.name}</div>
              <div className={styles['genres']}>{authorDetailsSummaryData.resources.artists[id].attributes.genreNames.join(', ')}</div>
            </div>
            <div className={styles['yt-artist-btn']}>
              <YtButton onClick={getGenericYtButtonEventChannel(modalSystem, authorDetailsSummaryData.resources.artists[id].attributes.name)}/>
            </div>
          </div>
          {authorLatestReleaseData?.data?.length && authorLatestReleaseData?.data?.length > 0 && ['songs', 'albums'].includes(authorLatestReleaseData.data[0].type) && 
            <div className={styles['latest-release-container']}>
              <div className={styles['header']}>
                Ostatnio wydane
              </div>
              <div className={styles['release']}>
                {authorLatestReleaseData.data[0].type === 'albums' &&
                  <AlbumRow {...albumDataToAlbumRowProps(
                    authorLatestReleaseData.data[0].attributes as unknown as AlbumAttributes, 
                    {
                      onYtClick: 
                        (authorLatestReleaseData.data[0].attributes as unknown as AlbumAttributes).isSingle ? 
                        getGenericYtButtonEventVideo(modalSystem, authorLatestReleaseData.data[0].attributes.name + ' ' + authorLatestReleaseData.data[0].attributes.artistName) :
                        getGenericYtButtonEventPlaylist(modalSystem, authorLatestReleaseData.data[0].attributes.name + ' ' + authorLatestReleaseData.data[0].attributes.artistName),
                      onRowClick: () => {
                        historyContext.pushToHistory({
                          history: {
                              component: AlbumInfoPage,
                              props: {id: authorLatestReleaseData.data[0].id},
                          }
                        })
                      }
                    },
                    {}
                  )}/>
                }
                {authorLatestReleaseData.data[0].type === 'songs' &&
                  <SongRow {...songDataToSongRowProps(
                    authorLatestReleaseData.data[0].attributes as unknown as SongAttributes,
                    {
                      onYtClick: getGenericYtButtonEventVideo(modalSystem, authorLatestReleaseData.data[0].attributes.name + ' ' + authorLatestReleaseData.data[0].attributes.artistName),
                      onRowClick: () => {
                        historyContext.pushToHistory({
                          history: {
                            component: SongInfoPageWithId,
                            props: {
                              //songKey: "157666207",
                              id: authorLatestReleaseData.data[0].id
                            },
                          },
                        });
                      }
                    },
                    {}
                  )}/>
                }
              </div>
            </div>
          }
          {
            Object.keys(authorDetailsSummaryData?.resources?.albums).length > 0 && <div className={styles['albums-container']}>
              <div className={styles['header']}>
                Albumy
              </div>
              <div className={styles['albums']}>
                {Object.values(authorDetailsSummaryData.resources.albums).map((v, i) => {
                  return (
                    <AlbumRow key={i + '_' + v.attributes.name} {...albumDataToAlbumRowProps(
                      v.attributes,
                      {
                        onYtClick: v.attributes.isSingle ? getGenericYtButtonEventVideo(modalSystem, v.attributes.name +  ' ' + v.attributes.artistName):
                          getGenericYtButtonEventPlaylist(modalSystem, v.attributes.name +  ' ' + v.attributes.artistName),
                        onRowClick: () => {
                          historyContext.pushToHistory({
                            history: {
                                component: AlbumInfoPage,
                                props: {id: v.id},
                            }
                          })
                        }
                      },
                      {}
                    )}/>
                  );
                })}
                </div>
            </div>
          }
          {
            authorTopSongsData?.data?.length && authorTopSongsData?.data?.length > 0 && <div className={styles['top-songs-container']}>
              <div className={styles['header']}>
                Najpopularniejsze utwory
              </div>
              <div className={styles['top-songs']}>
                {authorTopSongsData.data.map((v, i) => {
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
                      },
                      {}
                    )}/>
                  );
                })}
                </div>
            </div>
          }
          <div>

          </div>
        </div>
      </>}
    </>
  );
};

AuthorInfoPage.defaultProps = {

};

export default AuthorInfoPage;


/*const authorDetailsSummaryData = {
  "data": [
      {
          "id": "487143",
          "type": "artists"
      }
  ],
  "resources": {
      "artists": {
          "487143": {
              "id": "487143",
              "type": "artists",
              "attributes": {
                  "genreNames": [
                      "Rock"
                  ],
                  "name": "Pink Floyd",
                  "artwork": {
                      "width": 3840,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/{w}x{h}bb.jpg",
                      "height": 3840,
                      "textColor3": "cdcdcd",
                      "textColor2": "d6d6d6",
                      "textColor4": "adadad",
                      "textColor1": "ffffff",
                      "bgColor": "090909",
                      "hasP3": true
                  },
                  "url": "https://music.apple.com/us/artist/pink-floyd/487143"
              },
              "relationships": {
                  "albums": {
                      "data": [
                          {
                              "id": "1065973699",
                              "type": "albums"
                          },
                          {
                              "id": "1065975633",
                              "type": "albums"
                          },
                          {
                              "id": "1065973975",
                              "type": "albums"
                          },
                          {
                              "id": "1065974284",
                              "type": "albums"
                          },
                          {
                              "id": "1065976549",
                              "type": "albums"
                          },
                          {
                              "id": "1065973614",
                              "type": "albums"
                          },
                          {
                              "id": "1665303755",
                              "type": "albums"
                          },
                          {
                              "id": "1065974932",
                              "type": "albums"
                          },
                          {
                              "id": "1065977143",
                              "type": "albums"
                          },
                          {
                              "id": "1067444712",
                              "type": "albums"
                          },
                          {
                              "id": "1065975041",
                              "type": "albums"
                          },
                          {
                              "id": "1065975350",
                              "type": "albums"
                          },
                          {
                              "id": "1065975345",
                              "type": "albums"
                          },
                          {
                              "id": "919599477",
                              "type": "albums"
                          },
                          {
                              "id": "1065976276",
                              "type": "albums"
                          },
                          {
                              "id": "1065974579",
                              "type": "albums"
                          },
                          {
                              "id": "1590001237",
                              "type": "albums"
                          },
                          {
                              "id": "1631582682",
                              "type": "albums"
                          },
                          {
                              "id": "1066497829",
                              "type": "albums"
                          },
                          {
                              "id": "1065978159",
                              "type": "albums"
                          },
                          {
                              "id": "1065975072",
                              "type": "albums"
                          },
                          {
                              "id": "919600058",
                              "type": "albums"
                          },
                          {
                              "id": "1490675340",
                              "type": "albums"
                          },
                          {
                              "id": "1583036744",
                              "type": "albums"
                          },
                          {
                              "id": "1065974496",
                              "type": "albums"
                          }
                      ]
                  }
              },
              "views": {
                  "latest-release": {
                      "attributes": {
                          "title": "Latest Release"
                      },
                      "data": [
                          {
                              "id": "1665303573",
                              "type": "albums"
                          }
                      ]
                  },
                  "top-songs": {
                      "attributes": {
                          "title": "Top Songs"
                      },
                      "data": [
                          {
                              "id": "1065973980",
                              "type": "songs"
                          },
                          {
                              "id": "1065976170",
                              "type": "songs"
                          },
                          {
                              "id": "1065975638",
                              "type": "songs"
                          },
                          {
                              "id": "1065973708",
                              "type": "songs"
                          },
                          {
                              "id": "1065973706",
                              "type": "songs"
                          },
                          {
                              "id": "1065973704",
                              "type": "songs"
                          },
                          {
                              "id": "1065976163",
                              "type": "songs"
                          },
                          {
                              "id": "1065973707",
                              "type": "songs"
                          },
                          {
                              "id": "1065973709",
                              "type": "songs"
                          },
                          {
                              "id": "1065973711",
                              "type": "songs"
                          },
                          {
                              "id": "1065973977",
                              "type": "songs"
                          },
                          {
                              "id": "1065976152",
                              "type": "songs"
                          },
                          {
                              "id": "1065973979",
                              "type": "songs"
                          },
                          {
                              "id": "1065976155",
                              "type": "songs"
                          },
                          {
                              "id": "1065975636",
                              "type": "songs"
                          },
                          {
                              "id": "1065973710",
                              "type": "songs"
                          },
                          {
                              "id": "1065973705",
                              "type": "songs"
                          },
                          {
                              "id": "1065973712",
                              "type": "songs"
                          },
                          {
                              "id": "1065973702",
                              "type": "songs"
                          },
                          {
                              "id": "1065973978",
                              "type": "songs"
                          }
                      ]
                  }
              },
              "meta": {
                  "views": {
                      "order": [
                          "latest-release",
                          "top-songs"
                      ]
                  }
              }
          }
      },
      "albums": {
          "919599477": {
              "id": "919599477",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2014 Columbia Records, a Division of Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "2014-11-07",
                  "isMasteredForItunes": true,
                  "upc": "886444851466",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music125/v4/b8/c9/57/b8c957b2-1371-2919-4b82-bd329e3e5204/886444851466.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "c6c7c8",
                      "textColor2": "bdcde0",
                      "textColor4": "a7b3c4",
                      "textColor1": "e3e6e5",
                      "bgColor": "514b55",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-endless-river-deluxe-edition/919599477",
                  "playParams": {
                      "id": "919599477",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia",
                  "trackCount": 27,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Endless River (Deluxe Edition)",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Based on performances from late keyboardist Richard Wright during the recording of Pink Floyd’s last album (1994’s <i>The Division Bell</i>) and pulled into shape by guitarist David Gilmour and drummer Nick Mason, <i>The Endless River</i> is a nearly instrumental album that’s intended as the group’s last. Textures often revisit previous Floyd terrain. “Anisina” is reminiscent of “Us and Them.” “Allons-y” 1 and 2 quote ’70s Floyd. Additional contributors—Youth, Andy Jackson, and Roxy Music’s Phil Manzanera (but <b>no</b> Roger Waters)—augment the ambient beauty. Only “Louder Than Words” features Gilmour’s vocals as a final wave. The deluxe edition adds three bonus tracks and six videos."
                  },
                  "isComplete": true
              }
          },
          "919600058": {
              "id": "919600058",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2014 Columbia Records, a Division of Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock",
                      "Arena Rock"
                  ],
                  "releaseDate": "2014-11-07",
                  "upc": "886444851435",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is4-ssl.mzstatic.com/image/thumb/Music1/v4/63/32/f8/6332f811-527a-0ec3-e3d8-dc1a997b0e3c/dj.jzdkxzku.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "c6bab1",
                      "textColor2": "c6d2df",
                      "textColor4": "a4a8b2",
                      "textColor1": "f1e9dd",
                      "bgColor": "190100",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-endless-river/919600058",
                  "playParams": {
                      "id": "919600058",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia",
                  "isCompilation": false,
                  "trackCount": 18,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo",
                      "spatial",
                      "surround"
                  ],
                  "isSingle": false,
                  "name": "The Endless River",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "While recording 1994's <i>The Division Bell</i>, David Gilmour, Richard Wright, and Nick Mason also put to tape some ambient instrumental experiments they jokingly dubbed \"The Big Bong Theory.\" After Wright's death, Gilmour and Mason refashioned those ideas into Pink Floyd's farewell album, <i>The Endless River</i>. The richly textured music often revisits previous Floyd terrain: “Anisina” is reminiscent of “Us and Them,” while “Allons-y (1)\" quotes the disco-tinged throb of \"Run Like Hell.\" Amidst the ambient beauty, only the closing \"Louder Than Words\" features Gilmour's wistful vocals.",
                      "short": "The band ends with a lovely, melancholy farewell to the late Rick Wright."
                  },
                  "isComplete": true
              }
          },
          "1065973614": {
              "id": "1065973614",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock",
                      "Psychedelic",
                      "Arena Rock"
                  ],
                  "releaseDate": "1971-10-30",
                  "isMasteredForItunes": true,
                  "upc": "886445635911",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/ff/14/d5/ff14d50a-af6d-22d5-185a-6247bc008772/886445635911.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "3cbed3",
                      "textColor2": "48daf9",
                      "textColor4": "4dbad3",
                      "textColor1": "34e0fa",
                      "bgColor": "603839",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/meddle/1065973614",
                  "playParams": {
                      "id": "1065973614",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 6,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Meddle",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "For their sixth album, Pink Floyd kept experimenting with space and time, but with far greater confidence in their abilities than before. “One of These Days” is a rolling juggernaut of echoed bass, with organ and guitar hawkishly swooping about. In “Fearless” they play unvarnished folk rock; “Seamus” is straightforward blues with a howling dog solo. The opus “Echoes” is a stately 23-minute trip through what would become classic Floyd whisper-rock, taking in a greasy funk breakdown and wailing ghost noises.",
                      "short": "Excursions in space, time, and folk rock, plus a howling dog."
                  },
                  "isComplete": true
              }
          },
          "1065973699": {
              "id": "1065973699",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Psychedelic",
                      "Hard Rock",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1973-03-01",
                  "upc": "886445635829",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699",
                  "playParams": {
                      "id": "1065973699",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 10,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Dark Side of the Moon",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "editorialNotes": {
                      "standard": "<i>The Dark Side of the Moon</i> is a little like puberty: Feel how you want about it, but you’re gonna have to encounter it one way or another. Developed as a suite-like journey through the nature of human experience, the album not only set a new bar for rock music’s ambitions, but it also proved that suite-like journeys through the nature of human experience could actually make their way to the marketplace—a turn that helped reshape our understanding of what commercial music was and could be.<br />\nIf pop—even in the post-Beatles era—tended toward lightness and salability, <i>Dark Side</i> was dense and boldfaced; if pop was telescoped into bite sizes, <i>Dark Side</i> was shaped more like a novel or an opera, each track flowing into the next, bookended by that most nature-of-human-experience sounds, the heartbeat.<br /> \nEven compared to other rock albums of the time, <i>Dark Side</i> was a shift, forgoing the boozy extroversion of stuff like The Rolling Stones for something more interior, private, less fun but arguably more significant. In other words, if <i>Led Zeppelin IV</i> was something you could take out, <i>Dark Side</i> was strictly for going in. That the sound was even bigger and more dramatic than Zeppelin’s only bolstered the band’s philosophical point: What topography could be bigger and more dramatic than the human spirit?<br />\nAs much as the album marked a breakthrough, it was also part of a progression in which Floyd managed to join their shaggiest, most experimental phase (<i>Atom Heart Mother</i>, <i>Meddle</i>) with an emerging sense of clarity and critical edge, exploring big themes—greed (“Money”), madness (“Brain Damage,” “Eclipse”), war, and societal fraction (“Us and Them”)—with a concision that made the message easy to understand no matter how far out the music got. Drummer Nick Mason later noted that it was the first time they’d felt good enough about their lyrics—written this time entirely by Roger Waters—to print them on the album sleeve.<br />\nFor one of the most prominent albums in rock history, <i>Dark Side</i> is interestingly light on rocking. The cool jazz of Rick Wright’s electric piano, the well-documented collages of synthesizer and spoken word, the tactility of ambient music and dub—even when the band opened up and let it rip (say, “Any Colour You Like” or the ecstatic wail of “The Great Gig in the Sky”), the emphasis was more on texture and feel than the alchemy of musicians in a room.<br /> \nYes, the album set a precedent for arty, post-psychedelic voyagers like <i>OK Computer</i>-era Radiohead and Tame Impala, but it also marked a moment when rock music fused fully with electronic sound, a hybrid still vibrant more than five decades on. The journey here was ancient, but the sound was from the future.",
                      "short": "A boldfaced landmark in ’70s rock."
                  },
                  "isComplete": true
              }
          },
          "1065973975": {
              "id": "1065973975",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1975-09-12",
                  "isMasteredForItunes": true,
                  "upc": "886445635843",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "433938",
                      "textColor2": "25312d",
                      "textColor4": "515a57",
                      "textColor1": "140806",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/wish-you-were-here/1065973975",
                  "playParams": {
                      "id": "1065973975",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 5,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Wish You Were Here",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "As sprawling as their earlier epic <i>The Dark Side of the Moon</i> yet more focused, this 1975 jewel featured lengthy, left-of-center excursions (“Shine on You Crazy Diamond”) that were both majestic and reverent—along with a couple barbs thrown at the music industry (\"Have a Cigar,\" \"Welcome to the Machine\"). It's also partly Pink Floyd’s anguished and glorious tribute to the gifted Syd Barrett—whose career with the band ended seven years earlier—and a moving set from top to bottom.",
                      "short": "No other prog-leaning combo made an album this musically satisfying."
                  },
                  "isComplete": true
              }
          },
          "1065974284": {
              "id": "1065974284",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock",
                      "Arena Rock"
                  ],
                  "releaseDate": "1977-01-23",
                  "upc": "886445635942",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/6d/ef/ff/6deffff9-b10f-975a-337d-88ae2ac05cd0/886445635942.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "aa836d",
                      "textColor2": "e39252",
                      "textColor4": "ba7a48",
                      "textColor1": "cf9e7f",
                      "bgColor": "161824",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/animals/1065974284",
                  "playParams": {
                      "id": "1065974284",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 5,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Animals",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "editorialNotes": {
                      "standard": "Most of the British rock superstars of Pink Floyd's generation took little notice of the late-'70s punk revolution. While the three extended epics that make up the bulk of <i>Animals</i> couldn't sound less like the Sex Pistols, Roger Waters' venomous, Orwellian lyrics viciously dismiss the whole of modern British society as dogs, pigs, and sheep. That sense of seething contempt and anger makes <i>Animals</i> a spiritual cousin to the punks, though the hopeful two-part bookend \"Pigs on the Wing\" offers a welcoming sense of compassion.",
                      "short": "Their angriest album—think of it as Punk Floyd."
                  },
                  "isComplete": true
              }
          },
          "1065974496": {
              "id": "1065974496",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Psychedelic",
                      "Prog-Rock/Art Rock",
                      "Arena Rock"
                  ],
                  "releaseDate": "1971-05-14",
                  "isMasteredForItunes": true,
                  "upc": "886445613902",
                  "artwork": {
                      "width": 1400,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music125/v4/3f/a9/43/3fa9433c-7a1c-48ce-6837-f0f09962e66d/886445613902.jpg/{w}x{h}bb.jpg",
                      "height": 1400,
                      "textColor3": "bc7f4e",
                      "textColor2": "db8c56",
                      "textColor4": "b27148",
                      "textColor1": "e89e5e",
                      "bgColor": "100611",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/relics/1065974496",
                  "playParams": {
                      "id": "1065974496",
                      "kind": "album"
                  },
                  "recordLabel": "Pink Floyd Records",
                  "trackCount": 11,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Relics",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Representing Pink Floyd's magical early period, <i>Relics</i> combines album cuts with non-LP singles and one previously unreleased tune, the hypnotic, jazzy \"Biding My Time.\" Tuneful early hits \"See Emily Play\" and \"Arnold Layne\" overflow with psychedelic visionary Syd Barrett's eccentric brand of off-kilter genius, mixing British whimsy with trippy textures and an infectiously cracked pop sensibility. The rest of the compilation captures the band at their dreamiest and most melodic, proving that Floyd didn't have to be freaky to be fascinating.",
                      "short": "Celebrating the Floyd's first cosmic classics."
                  },
                  "isComplete": true
              }
          },
          "1065974579": {
              "id": "1065974579",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock",
                      "Arena Rock",
                      "Psychedelic"
                  ],
                  "releaseDate": "1968-06-29",
                  "isMasteredForItunes": true,
                  "upc": "886445635881",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music125/v4/93/89/68/93896876-df27-4e92-3a31-47113d060d1c/886445635881.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "b99a77",
                      "textColor2": "cda068",
                      "textColor4": "a68255",
                      "textColor1": "e5bd93",
                      "bgColor": "0a0c07",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/a-saucerful-of-secrets/1065974579",
                  "playParams": {
                      "id": "1065974579",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 7,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "A Saucerful of Secrets",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "On their second album, Pink Floyd shifted from quirky psych-pop to a full-on space-rock assault. <i>A Saucerful of Secrets</i> was a giant step towards the kind of cosmic exploits they'd soon be famous for. Syd Barrett ceded the spotlight to new guitarist David Gilmour, but the trippy intensity of extended tracks like the hypnotic, Eastern-tinged \"Set the Controls for the Heart of the Sun\" and the brain-melting avant-garde title track left no doubt that Floyd were the rulers of the acid-rock realm.",
                      "short": "The psychedelic soldiers become cosmic adventurers."
                  },
                  "isComplete": true
              }
          },
          "1065974932": {
              "id": "1065974932",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd (1987) Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1987-09-07",
                  "isMasteredForItunes": true,
                  "upc": "886445635935",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/63/a2/c9/63a2c91a-0d7f-634d-b672-a38493b9e0ed/886445635935.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "cac1b7",
                      "textColor2": "d69f5d",
                      "textColor4": "b2824c",
                      "textColor1": "f5ede3",
                      "bgColor": "220f08",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/a-momentary-lapse-of-reason/1065974932",
                  "playParams": {
                      "id": "1065974932",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 11,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "A Momentary Lapse of Reason",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "David Gilmour took some criticism for carrying on Pink Floyd without Roger Waters—not least from Waters himself. Begun as a solo album, this became the relaunch of Pink Floyd when cofounders Rick Wright and Nick Mason joined in. Gilmour's less-acidic worldview means <i>A Momentary Lapse of Reason</i> lacks the pointed lyrical edge of the last handful of Floyd albums. But the lush, richly detailed arrangements of tracks like the dreamy \"Learning to Fly\" give Gilmour's liquid guitar solos room to evolve.",
                      "short": "With Waters gone, Gilmour answers the question \"Which one's Pink?\""
                  },
                  "isComplete": true
              }
          },
          "1065975041": {
              "id": "1065975041",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Psychedelic",
                      "Prog-Rock/Art Rock",
                      "Arena Rock",
                      "British Invasion"
                  ],
                  "releaseDate": "1967-08-05",
                  "isMasteredForItunes": true,
                  "upc": "886445635799",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music69/v4/07/cd/c9/07cdc978-7bc4-08ab-89e5-dab18a42b863/886445635799.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "9fad96",
                      "textColor2": "c6cfa4",
                      "textColor4": "a5aa88",
                      "textColor1": "bed2b6",
                      "bgColor": "221816",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-piper-at-the-gates-of-dawn/1065975041",
                  "playParams": {
                      "id": "1065975041",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 11,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Piper at the Gates of Dawn",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Even though Pink Floyd's debut album followed <i>Sgt. Pepper's</i> by a couple of months, nothing could have prepared the world for the magical blend of genius and LSD-induced madness that drove Floyd frontman Syd Barrett's dazzling psychedelic vision. Barrett's cubist guitar riffs collide magnificently with Rick Wright's hypnotic, snake-charmer organ lines amid a dizzying merry-go-round of sound effects. All the while, Syd's equally abstract lyrical approach freely mixes fairytale imagery with cosmic explorations—the ideal soundtrack for journeys through both outer and inner space.",
                      "short": "A psychedelic landmark dancing on the edge of madness."
                  },
                  "isComplete": true
              }
          },
          "1065975072": {
              "id": "1065975072",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Soundtrack",
                      "Music"
                  ],
                  "releaseDate": "1969-06-15",
                  "isMasteredForItunes": true,
                  "upc": "886445635805",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is4-ssl.mzstatic.com/image/thumb/Music7/v4/80/00/19/80001972-3f7c-220b-a382-d310570e09f1/886445635805.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "302414",
                      "textColor2": "0d1819",
                      "textColor4": "383322",
                      "textColor1": "030608",
                      "bgColor": "e29c46",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/more-original-film-soundtrack/1065975072",
                  "playParams": {
                      "id": "1065975072",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 13,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "More (Original Film Soundtrack)",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Though it was officially a soundtrack for a rarely seen Barbet Schroeder film, <i>More</i> is a hugely important transitional album for Pink Floyd. Here the post-Syd Barrett lineup moves away from freeform psychedelia and masters song structure, while keeping their experimental edge. There's a lost classic in Roger Waters' soaring, spooky \"Cymbaline,\" while \"The Nile Song\" is one of their heaviest rockers. But <i>More</i> mostly features the band's lyrical side: \"Green Is the Colour\" has to be the only Floyd song featuring a pennywhistle.",
                      "short": "Lost gems and pennywhistles in one of Floyd's most overlooked gems."
                  },
                  "isComplete": true
              }
          },
          "1065975345": {
              "id": "1065975345",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Psychedelic",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1970-10-02",
                  "upc": "886445635836",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1419,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music49/v4/ac/00/35/ac0035b1-2f21-4a15-9746-646354c811c2/886445635836.jpg/{w}x{h}bb.jpg",
                      "height": 1419,
                      "textColor3": "2a3031",
                      "textColor2": "102011",
                      "textColor4": "31453d",
                      "textColor1": "070602",
                      "bgColor": "b6d8ed",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/atom-heart-mother/1065975345",
                  "playParams": {
                      "id": "1065975345",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 5,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Atom Heart Mother",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "1970 found Pink Floyd at their wildly experimental peak. Covering the first side of the original LP, the 23-minute instrumental title track is wonderfully grandiose, featuring some killer David Gilmour guitar solos and the band's first (and last) extensive use of orchestra and choir. Before the album ends with the quirky tape-loop-enhanced epic \"Alan's Psychedelic Breakfast,\" a trio of remarkably lovely acoustic songs—highlighted by Roger Waters' delicately philosophical \"If\"—showcases the band's growing lyrical sophistication.",
                      "short": "The rock legends' strangest album—and that's saying something."
                  },
                  "isComplete": true
              }
          },
          "1065975350": {
              "id": "1065975350",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Psychedelic",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1972-06-02",
                  "upc": "886445635928",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is4-ssl.mzstatic.com/image/thumb/Music7/v4/f1/84/8c/f1848cd5-6498-7fc8-288a-0b3d3a03f711/886445635928.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "bec0a3",
                      "textColor2": "dbcaa0",
                      "textColor4": "b3a785",
                      "textColor1": "e8e9c5",
                      "bgColor": "171b1a",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/obscured-by-clouds/1065975350",
                  "playParams": {
                      "id": "1065975350",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 10,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Obscured By Clouds",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Working again with director Barbet Schroeder, Pink Floyd created this soundtrack for the film <i>La Vallée</i> over a two-week period in early 1972. It was a relatively quick session for the group, which was also recording <i>The Dark Side of the Moon</i> back in London. To compare it to the soundtrack they had recorded just three years earlier (<i>More</i>) is remarkable—just listen to the tightly arranged, pastoral wonder of “Wot’s ... Uh the Deal” or the nearly glam, folk sing-along “Free Four.” With the dark, paranoia-and-synthesizer-tinged “Childhood’s End,” you can hear the seeds of the music that come to fruition on <i>The Dark Side ... </i>. At this point in their career, Pink Floyd had developed into a distinct and powerful group—veering between stately rock ’n’ roll and wide-eyed wonder at the drop of a dime. All the pieces of the band were in place on this album—lyrical introspection, Gilmour’s soaring guitar work, and the loping gait of the rhythm section. "
                  },
                  "isComplete": true
              }
          },
          "1065975633": {
              "id": "1065975633",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock",
                      "Arena Rock",
                      "Hard Rock"
                  ],
                  "releaseDate": "1979-11-30",
                  "upc": "886445635850",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-wall/1065975633",
                  "playParams": {
                      "id": "1065975633",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 26,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Wall",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "You could say <i>The Wall</i> started taking shape the night Roger Waters leaned over the edge of the stage and spit in a fan’s face. This was July 1977: The band was finishing out their lengthy In the Flesh tour to stadium-size crowds, working at scales unfamiliar and uncomfortable to everyone involved. Risky investments had put them under major financial pressure; audiences seemed more interested in the party than the show; band rapport had gotten so strained that Waters started referring to the rest of the members as “the muffins.”<br />\nAnd so, alone in a crowd of about 80,000 people, standing under the 40-foot-long inflatable pig that had become a central prop of the band’s set, Waters spit. Later that night, he told the producer Bob Ezrin and a psychiatrist friend of Ezrin’s that he sometimes fantasized about building a wall between himself and the audience—an embodiment of how isolated he already felt, and a device by which he could protect what little of himself he thought he had left.<br />\nWhat emerged from that mental image was one of the last, and one of the greatest, gasps of the concept album—that naively romantic idea that music could somehow reach out of the confines of the recorded medium and tell a story that would resonate with the metaphoric heft of a novel. At 80 minutes, <i>The Wall</i> didn’t spare listeners any of Waters’ creative largesse. If anything, it laid bare his inner turmoil (and outer critique) with almost forensic precision: The album traces the long arc of a fictional rock star named Pink Floyd, who evolves from lonely boy to maniacal fascist. Pink starts pointing fingers at everyone from Mom (“Mother”) to the education system (“The Happiest Days of Our Lives,” “Another Brick in the Wall, Pt. 2”) to blacks, gays, and Jews (“In the Flesh”) to modern life in general (“The Thin Ice”) before realizing that maybe the problem was him all along (“Stop,” “The Trial”)—an arc even more resonant in light of our societal reckoning with the evil men do.<br />\nYeah, it’s a lot, especially as a morality play put on by the rich and famous. But despite their popularity, Pink Floyd was never exactly a friendly band. If anything, <i>The Wall</i> holds up in part because of how profoundly ugly it is, the externalization of feelings so cruel and noxious that people hate to admit even having them, let alone mining them for art. (In that respect, they had more in common with punk than the punks would probably admit.) What had once felt expansive (take the long song-suites of <i>Animals</i> or <i>The Dark Side of the Moon</i>) now felt claustrophobic and fragmented, a picture rendered in shrapnel. In nudging Waters toward his most theatrical impulses, producer Ezrin—famous in part for helping create Alice Cooper—gave the album a narrative through line as comforting and familiar as an old myth (the traumatic rise and tragic fall, the superhero rendered human once again), but gave the impression of wholeness where Waters’ collage-like vision didn’t necessarily imply one. At one point, Ezrin suggested that guitarist David Gilmour go to a club to hear the then-new sound of disco. Gilmour hated it, but got the point: Listen to the rigid pacing of “Another Brick in the Wall, Pt. 2” and “Run Like Hell”—this wasn’t music about freedom, but about being martially locked in place. By the time you get to “Comfortably Numb,” a life without feeling doesn’t sound half bad.<br />\nIn addition to elevating them to implausibly greater levels of fame, <i>The Wall</i> marked the last time Waters and the rest of the band would work together in a meaningful way. During the album’s sessions, Waters effectively forced keyboardist Rick Wright out; shortly after 1983’s <i>The Final Cut</i>, Waters quit. In between, they managed to take <i>The Wall</i> on tour. Waters got his wish: During the first half of the show, roadies constructed a wall, brick by cardboard brick, approximately 40 feet in the middle and 130 feet across the top—an embodiment not just of Waters’ concept, but of the band’s general ability to strong-arm reality to suit their dreams. Ezrin, who had run afoul of Waters after unwittingly telling a journalist friend what the conceit of the show was going to be, was forced to buy his own ticket.",
                      "short": "Blockbuster bleakness from a band at their peak, 40 years later."
                  },
                  "isComplete": true
              }
          },
          "1065976276": {
              "id": "1065976276",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this compilation is owned by Pink Floyd (1987) Ltd., marketed and distributed by Sony Music Entertainment.",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "releaseDate": "1988-11-22",
                  "upc": "886445613889",
                  "isMasteredForItunes": false,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music49/v4/aa/22/0e/aa220e6e-4dc0-4aaa-aec8-69ae20aed54d/886445613889.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "b3c3c8",
                      "textColor2": "b8d8f5",
                      "textColor4": "95afc6",
                      "textColor1": "def2f8",
                      "bgColor": "090b0a",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/delicate-sound-of-thunder-live/1065976276",
                  "playParams": {
                      "id": "1065976276",
                      "kind": "album"
                  },
                  "recordLabel": "Pink Floyd Records",
                  "isCompilation": false,
                  "trackCount": 15,
                  "isPrerelease": false,
                  "audioTraits": [
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Delicate Sound of Thunder (Live)",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "Though Roger Waters had left the group in the early '80s, Pink Floyd soldiered on as a trio, highly fortified by guest musicians. <i>Delicate Sound of Thunder</i> is a live album recorded in August 1988 over a five-night stay at New York's Nassau Coliseum on Long Island, featuring big songs from Pink Floyd's quartet days and six tracks from its then-current studio album, <i>A Momentary Lapse of Reason</i>. Keyboardist Richard Wright handled lead vocals for \"Time\" and \"Comfortably Numb,\" while the remainder of Waters' vocal parts were done more than capably by David Gilmour, who'd always had the group's more pleasing voice and was often its lead singer. Of the classics, \"Shine On You Crazy Diamond\" is more about Gilmour's shimmering leads and the interplay between guitar and keyboards, while \"One of These Days\" is a welcome deep-album cut that features Pink Floyd at its most psychedelic. \"Comfortably Numb\" centers around Gilmour's legendary guitar solo, while \"Another Brick in the Wall (Part 2)\" is a perfect song for an arena crowd."
                  },
                  "isComplete": true
              }
          },
          "1065976549": {
              "id": "1065976549",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd (1987) Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1994-03-28",
                  "upc": "886445627572",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 1500,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/c6/49/fc/c649fc21-4c65-d55d-71a4-dac0c39e7a56/886445627572.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "262420",
                      "textColor2": "2b1e13",
                      "textColor4": "483c2f",
                      "textColor1": "000000",
                      "bgColor": "bdb5a0",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-division-bell/1065976549",
                  "playParams": {
                      "id": "1065976549",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 11,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo",
                      "spatial",
                      "surround"
                  ],
                  "isSingle": false,
                  "name": "The Division Bell",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "editorialNotes": {
                      "standard": "At the dawn of the Internet Age, personal communication became the touchstone of Pink Floyd's second post-Roger Waters album. With Rick Wright and Nick Mason fully reintegrated into the band, the songs are full of spacious, Floydian textures beneath deeply personal, introspective lyrics. David Gilmour shouts to be heard on “What Do You Want from Me”—one of Floyd’s toughest rockers. On “Keep Talking,” his pleading vocals become nearly drowned out by ominous funk beats and the synthetic voice of Stephen Hawking.",
                      "short": "A meditative examination of the importance of communication."
                  },
                  "isComplete": true
              }
          },
          "1065977143": {
              "id": "1065977143",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1983-03-21",
                  "isMasteredForItunes": true,
                  "upc": "886445635904",
                  "artwork": {
                      "width": 1495,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/4d/1a/a5/4d1aa517-d701-c6cd-5965-0652f5eee7bf/886445635904.jpg/{w}x{h}bb.jpg",
                      "height": 1495,
                      "textColor3": "cdc8be",
                      "textColor2": "f48b38",
                      "textColor4": "c87534",
                      "textColor1": "faf2e5",
                      "bgColor": "1a1d22",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-final-cut/1065977143",
                  "playParams": {
                      "id": "1065977143",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 13,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Final Cut",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "editorialNotes": {
                      "standard": "Roger Waters dominated Pink Floyd on <i>The Wall</i>, but the follow-up was nearly his first solo album. Rick Wright had been fired, studio musicians supplant the band, and even David Gilmour only sings lead on the scabrous rocker \"Not Now John.\" Recorded during the build-up to the Falklands War, Waters' lyrics reflect his personal demons: corruption, societal breakdown, and—looming over everything—his father's death in World War II. But there's compassion in Waters' worldview and a few glimpses of hope amidst the bitterness.",
                      "short": "Roger Waters' darker preoccupations dominate his last Floyd album."
                  },
                  "isComplete": true
              }
          },
          "1065978159": {
              "id": "1065978159",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Psychedelic",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1969-10-25",
                  "isMasteredForItunes": true,
                  "upc": "886445635812",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music2/v4/05/93/6d/05936d1f-5476-d791-438f-9b3573fd2bee/886445635812.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "e4d19f",
                      "textColor2": "e3e1b5",
                      "textColor4": "cfc79c",
                      "textColor1": "feedb9",
                      "bgColor": "7b5f39",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/ummagumma/1065978159",
                  "playParams": {
                      "id": "1065978159",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 16,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Ummagumma",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "<i>Ummagumma</i> is Floyd at their most cosmically adventurous—and one of the most joyously freaky records ever released by a major label. On the live half, the band attacks already-trippy material like the swirling \"Astronomy Domine\" with an even more ominous, otherworldly feel. The studio recordings are solo efforts by all four band members, crafting heady prog-rock suites and mind-blowing avant-garde sound collages. In the middle sits Roger Waters' chiming \"Grantchester Meadows,\" pointing the way to the delicate, atmospheric tunes that would become Floyd mainstays.",
                      "short": "The prog masters at their most adventurous and experimental."
                  },
                  "isComplete": true
              }
          },
          "1066497829": {
              "id": "1066497829",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this compilation is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock",
                      "Hard Rock",
                      "Psychedelic"
                  ],
                  "releaseDate": "2001-11-05",
                  "isMasteredForItunes": false,
                  "upc": "886445613940",
                  "artwork": {
                      "width": 1512,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music7/v4/d3/5f/cd/d35fcd08-fc65-e5d6-487e-94db6d7b188f/886445613940.jpg/{w}x{h}bb.jpg",
                      "height": 1512,
                      "textColor3": "cbc4bf",
                      "textColor2": "f1f5f6",
                      "textColor4": "c1c4c5",
                      "textColor1": "fef5ee",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/echoes-the-best-of-pink-floyd/1066497829",
                  "playParams": {
                      "id": "1066497829",
                      "kind": "album"
                  },
                  "recordLabel": "Pink Floyd Records",
                  "isCompilation": false,
                  "trackCount": 26,
                  "isPrerelease": false,
                  "audioTraits": [
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Echoes: The Best of Pink Floyd",
                  "artistName": "Pink Floyd",
                  "editorialNotes": {
                      "standard": "There's no way that a visionary band like Pink Floyd can be summed up in a conventional greatest-hits collection, but <i>Echoes</i> is just offbeat enough to work. Instead of boring old chronological order, it jumps freely between the psychedelic Syd Barrett era, the prog-rock majesty of the classic lineup, and David Gilmour's last stand. Late-night FM hits sit right next to side-long epics. Most interestingly, new segues link all the songs together, making this a cohesive concept album in its own right.",
                      "short": "FM hits. Side-long epics. And everything else in between."
                  },
                  "isComplete": true
              }
          },
          "1067444712": {
              "id": "1067444712",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2016 The copyright in this compilation is owned by Pink Floyd Music Ltd. / Pink Floyd (1987) Ltd., marketed and distributed by Sony Music Entertainment.",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Psychedelic",
                      "Classical",
                      "Modern Era",
                      "Hard Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "2011-11-07",
                  "isMasteredForItunes": true,
                  "upc": "886445636093",
                  "artwork": {
                      "width": 1400,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/fe/54/24/fe542475-2143-490f-62ae-855dd7b47086/886445636093.jpg/{w}x{h}bb.jpg",
                      "height": 1400,
                      "textColor3": "cecdce",
                      "textColor2": "e0d6d0",
                      "textColor4": "bab1ac",
                      "textColor1": "f9f9f9",
                      "bgColor": "231f20",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/a-foot-in-the-door-the-best-of-pink-floyd/1067444712",
                  "playParams": {
                      "id": "1067444712",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "isCompilation": false,
                  "trackCount": 16,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "A Foot In the Door: The Best of Pink Floyd",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "isComplete": true
              }
          },
          "1490675340": {
              "id": "1490675340",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2019 Pink Floyd (1987) Ltd., under exclusive license to Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "2019-12-13",
                  "isMasteredForItunes": true,
                  "upc": "886447919934",
                  "artwork": {
                      "width": 3000,
                      "url": "https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/a4/fb/4c/a4fb4c3a-f8cc-f8da-f266-e327ce2deda0/886447919934.jpg/{w}x{h}bb.jpg",
                      "height": 3000,
                      "textColor3": "8cbab9",
                      "textColor2": "e8d0ac",
                      "textColor4": "c0ab8f",
                      "textColor1": "a6e3e1",
                      "bgColor": "22171a",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-later-years/1490675340",
                  "playParams": {
                      "id": "1490675340",
                      "kind": "album"
                  },
                  "recordLabel": "Legacy Recordings",
                  "trackCount": 46,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "The Later Years",
                  "artistName": "Pink Floyd",
                  "isComplete": true
              }
          },
          "1583036744": {
              "id": "1583036744",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2021 Pink Floyd (87) Ltd., under exclusive license to Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1987-09-08",
                  "upc": "886448395850",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 3702,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/17/86/a9/1786a9e5-81cd-07ff-ad59-41ef5e5f98c4/886448395850.jpg/{w}x{h}bb.jpg",
                      "height": 3702,
                      "textColor3": "d8d8da",
                      "textColor2": "ebebf7",
                      "textColor4": "cdcce3",
                      "textColor1": "f8faec",
                      "bgColor": "585292",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/a-momentary-lapse-of-reason-2019-remix/1583036744",
                  "playParams": {
                      "id": "1583036744",
                      "kind": "album"
                  },
                  "recordLabel": "Legacy Recordings",
                  "isCompilation": false,
                  "trackCount": 11,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo",
                      "spatial",
                      "surround"
                  ],
                  "isSingle": false,
                  "name": "A Momentary Lapse of Reason (2019 Remix)",
                  "artistName": "Pink Floyd",
                  "isComplete": true
              }
          },
          "1590001237": {
              "id": "1590001237",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 1995 The copyright in this sound recording is owned by Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Arena Rock",
                      "Hard Rock",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1995-05-29",
                  "isMasteredForItunes": true,
                  "upc": "886449594634",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is2-ssl.mzstatic.com/image/thumb/Music125/v4/84/eb/6b/84eb6bde-abe3-adc9-c3d5-574f40acf5fb/886449594634.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "d3d9e4",
                      "textColor2": "e0f1e5",
                      "textColor4": "bfd4d1",
                      "textColor1": "f9f8fd",
                      "bgColor": "3d5e80",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/pulse-live/1590001237",
                  "playParams": {
                      "id": "1590001237",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 25,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Pulse (Live)",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "isComplete": true
              }
          },
          "1631582682": {
              "id": "1631582682",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2022 Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1977-01-23",
                  "isMasteredForItunes": true,
                  "upc": "196589270573",
                  "artwork": {
                      "width": 3000,
                      "url": "https://is2-ssl.mzstatic.com/image/thumb/Music122/v4/c7/38/9c/c7389cc5-ae8c-63bd-5026-e27a6585bc68/196589270573.jpg/{w}x{h}bb.jpg",
                      "height": 3000,
                      "textColor3": "a2acb4",
                      "textColor2": "aabbc4",
                      "textColor4": "8b9aa2",
                      "textColor1": "c6d2db",
                      "bgColor": "10151b",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/animals-2018-remix/1631582682",
                  "playParams": {
                      "id": "1631582682",
                      "kind": "album"
                  },
                  "recordLabel": "Columbia/Legacy",
                  "trackCount": 5,
                  "isCompilation": false,
                  "isPrerelease": false,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "isSingle": false,
                  "name": "Animals (2018 Remix)",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "isComplete": true
              }
          },
          "1665303573": {
              "id": "1665303573",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2023 Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "releaseDate": "2023-03-24",
                  "isMasteredForItunes": true,
                  "upc": "196589557414",
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
                  "trackCount": 10,
                  "isCompilation": false,
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
              }
          },
          "1665303755": {
              "id": "1665303755",
              "type": "albums",
              "attributes": {
                  "copyright": "℗ 2023 Pink Floyd Music Ltd., marketed and distributed by Sony Music Entertainment",
                  "genreNames": [
                      "Rock",
                      "Music",
                      "Hard Rock",
                      "Arena Rock",
                      "Psychedelic",
                      "Prog-Rock/Art Rock"
                  ],
                  "releaseDate": "1973-03-01",
                  "upc": "196589805232",
                  "isMasteredForItunes": true,
                  "artwork": {
                      "width": 4167,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music123/v4/de/e1/22/dee122e8-c9b6-9d06-185b-9a665c5e5f52/196589805232.jpg/{w}x{h}bb.jpg",
                      "height": 4167,
                      "textColor3": "c5c6c7",
                      "textColor2": "f28229",
                      "textColor4": "c36a23",
                      "textColor1": "f4f4f6",
                      "bgColor": "090b0a",
                      "hasP3": false
                  },
                  "url": "https://music.apple.com/us/album/the-dark-side-of-the-moon-50th-anniversary-remastered/1665303755",
                  "playParams": {
                      "id": "1665303755",
                      "kind": "album"
                  },
                  "recordLabel": "Legacy Recordings",
                  "isCompilation": false,
                  "trackCount": 10,
                  "isPrerelease": false,
                  "audioTraits": [
                      "atmos",
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo",
                      "spatial"
                  ],
                  "isSingle": false,
                  "name": "The Dark Side of the Moon (50th Anniversary) [Remastered]",
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit",
                  "editorialNotes": {
                      "standard": "<i>The Dark Side of the Moon</i> is a little like puberty: Feel how you want about it, but you’re gonna have to encounter it one way or another. Developed as a suitelike journey through the nature of human experience, the album not only set a new bar for rock music’s ambitions, but it also proved that suitelike journeys through the nature of human experience could actually make their way to the marketplace—a turn that helped reshape our understanding of what commercial music was and could be.\n\nIf pop—even in the post-Beatles era—tended toward lightness and salability, <i>Dark Side</i> was dense and boldfaced; if pop was telescoped into bite sizes, <i>Dark Side</i> was shaped more like a novel or an opera, each track flowing into the next, bookended by that most nature-of-human-experience sounds, the heartbeat. Even compared to other rock albums of the time, <i>Dark Side</i> was a shift, forgoing the boozy extroversion of bands like The Rolling Stones for something more interior and private—less fun but arguably more significant. Put differently, if <i>Led Zeppelin IV</i> was something you could take out, <i>Dark Side</i> was strictly for going in. That the sound was even bigger and more dramatic than Zeppelin’s only bolstered the band’s philosophical point: What topography could be bigger and more dramatic than the human spirit?\n\nBut for as much as the album marked a breakthrough, it was also part of a progression in which Floyd managed to join their shaggiest, most experimental phase (<i>Atom Heart Mother</i>, <i>Meddle</i>) with an emerging sense of clarity and critical edge, exploring big themes—greed (“Money”), madness (“Brain Damage,” “Eclipse”), war and societal fraction (“Us and Them”)—with a concision that made the message easy to understand no matter how far out the music got. Drummer Nick Mason later noted that it was the first time they’d felt good enough about their lyrics—written this time entirely by Roger Waters—to print them on the album sleeve.\n\nAnd even for one of the most prominent albums in rock history, <i>Dark Side</i> is curiously light on rocking. The cool jazz of Rick Wright’s electric piano, the well-documented collages of synthesizer and spoken word, the tactility of ambient music and dub—even when the band opened up and let it rip (say, “Any Colour You Like” or the ecstatic wail of “The Great Gig in the Sky”), the emphasis was more on texture and feel than the alchemy of musicians in a room.\n\nThough <i>The Dark Side of the Moon</i> would set a precedent for arty, post-psychedelic voyagers like <i>OK Computer</i>-era Radiohead and Tame Impala, it also marked a moment when rock music fused fully with electronic sound, a hybrid still vibrant more than five decades on. The journey here was ancient, but the sound was from the future.",
                      "tagline": "New Anniversary Edition"
                  },
                  "isComplete": true
              }
          }
      },
      "songs": {
          "1065973702": {
              "id": "1065973702",
              "type": "songs",
              "attributes": {
                  "albumName": "The Dark Side of the Moon",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 1,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 64333,
                  "isVocalAttenuationAllowed": false,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100076",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Nick Mason",
                  "url": "https://music.apple.com/us/album/speak-to-me/1065973699?i=1065973702",
                  "playParams": {
                      "id": "1065973702",
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
                  "name": "Speak to Me",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/bb/10/43/bb104333-fea4-8ad4-51ce-fa1bac200420/mzaf_17244326432001226625.plus.aac.p.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit"
              }
          },
          "1065973704": {
              "id": "1065973704",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "The Dark Side of the Moon",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 2,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 169560,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100077",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters, Richard Wright & David Gilmour",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/breathe-in-the-air/1065973699?i=1065973704",
                  "playParams": {
                      "id": "1065973704",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Breathe (In the Air)",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e7/e0/d1/e7e0d14c-9f93-3c3d-3e3e-208b5e8a16bf/mzaf_13329552186963021712.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973705": {
              "id": "1065973705",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "The Dark Side of the Moon",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 3,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 216107,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100078",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "composerName": "David Gilmour & Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/on-the-run/1065973699?i=1065973705",
                  "playParams": {
                      "id": "1065973705",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "On the Run",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/20/12/9f/20129f9d-1500-db7a-e0fe-378d66547fb8/mzaf_8953071379440978548.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973706": {
              "id": "1065973706",
              "type": "songs",
              "attributes": {
                  "albumName": "The Dark Side of the Moon",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 4,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 422853,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100079",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters, David Gilmour, Nick Mason & Richard Wright",
                  "url": "https://music.apple.com/us/album/time/1065973699?i=1065973706",
                  "playParams": {
                      "id": "1065973706",
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
                  "name": "Time",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/8b/ed/da8bed67-d37d-eb79-d045-ab9b2770d945/mzaf_13544500942081182780.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973707": {
              "id": "1065973707",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": false,
                  "albumName": "The Dark Side of the Moon",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 5,
                  "durationInMillis": 284413,
                  "releaseDate": "1973-03-01",
                  "isVocalAttenuationAllowed": false,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100080",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "composerName": "Richard Wright & Clare Torry",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/the-great-gig-in-the-sky/1065973699?i=1065973707",
                  "playParams": {
                      "id": "1065973707",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "The Great Gig In the Sky",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/64/51/55/645155d0-6975-ccb8-09c4-e12e9c8142d6/mzaf_3110260876153319291.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973708": {
              "id": "1065973708",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": false,
                  "albumName": "The Dark Side of the Moon",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 6,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 380080,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100081",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/money/1065973699?i=1065973708",
                  "playParams": {
                      "id": "1065973708",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Money",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2c/27/18/2c271828-8eac-8fba-3f84-04de0ade8c8e/mzaf_1220942864668452409.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd",
                  "contentRating": "explicit"
              }
          },
          "1065973709": {
              "id": "1065973709",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": false,
                  "albumName": "The Dark Side of the Moon",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 7,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 472627,
                  "isVocalAttenuationAllowed": false,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100082",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters & Richard Wright",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/us-and-them/1065973699?i=1065973709",
                  "playParams": {
                      "id": "1065973709",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Us and Them",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a2/26/17/a2261784-3298-4f2f-311e-fc72efe12b28/mzaf_4214166784119572355.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973710": {
              "id": "1065973710",
              "type": "songs",
              "attributes": {
                  "albumName": "The Dark Side of the Moon",
                  "hasTimeSyncedLyrics": false,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 8,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 205773,
                  "isVocalAttenuationAllowed": false,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100083",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "audioLocale": "zxx",
                  "composerName": "David Gilmour, Nick Mason & Richard Wright",
                  "url": "https://music.apple.com/us/album/any-colour-you-like/1065973699?i=1065973710",
                  "playParams": {
                      "id": "1065973710",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "hasLyrics": false,
                  "isAppleDigitalMaster": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Any Colour You Like",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/80/68/b6/8068b607-52bb-f9ab-8cc6-ef60fa9935cb/mzaf_16332081719823988487.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973711": {
              "id": "1065973711",
              "type": "songs",
              "attributes": {
                  "albumName": "The Dark Side of the Moon",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 9,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 230493,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100140",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters",
                  "url": "https://music.apple.com/us/album/brain-damage/1065973699?i=1065973711",
                  "playParams": {
                      "id": "1065973711",
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
                  "name": "Brain Damage",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/58/5b/bb/585bbb32-7f6f-d6fd-2470-e02d7414544e/mzaf_6036343664090771981.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973712": {
              "id": "1065973712",
              "type": "songs",
              "attributes": {
                  "albumName": "The Dark Side of the Moon",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 10,
                  "releaseDate": "1973-03-01",
                  "durationInMillis": 126720,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100084",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "ccc000",
                      "textColor2": "f96424",
                      "textColor4": "c7501d",
                      "textColor1": "fff000",
                      "bgColor": "010101",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters",
                  "url": "https://music.apple.com/us/album/eclipse/1065973699?i=1065973712",
                  "playParams": {
                      "id": "1065973712",
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
                  "name": "Eclipse",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/08/51/0f/08510f57-4ec3-33be-51df-4328cafd55b0/mzaf_7055251135484643380.plus.aac.p.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973977": {
              "id": "1065973977",
              "type": "songs",
              "attributes": {
                  "albumName": "Wish You Were Here",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 1,
                  "durationInMillis": 812800,
                  "releaseDate": "1975-09-12",
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100085",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "433938",
                      "textColor2": "25312d",
                      "textColor4": "515a57",
                      "textColor1": "140806",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "David Gilmour, Richard Wright & Roger Waters",
                  "url": "https://music.apple.com/us/album/shine-on-you-crazy-diamond-pts-1-5/1065973975?i=1065973977",
                  "playParams": {
                      "id": "1065973977",
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
                  "name": "Shine On You Crazy Diamond, Pts. 1-5",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/1c/d1/1d/1cd11d4d-3dca-3af8-035e-e9f1543cac87/mzaf_16890531379678054079.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973978": {
              "id": "1065973978",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "Wish You Were Here",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 2,
                  "durationInMillis": 450707,
                  "releaseDate": "1975-09-12",
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100086",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "433938",
                      "textColor2": "25312d",
                      "textColor4": "515a57",
                      "textColor1": "140806",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/welcome-to-the-machine/1065973975?i=1065973978",
                  "playParams": {
                      "id": "1065973978",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Welcome to the Machine",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/32/52/0a/32520ae4-23ec-a30f-38ee-a4581cf8dac5/mzaf_16177853848787804522.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973979": {
              "id": "1065973979",
              "type": "songs",
              "attributes": {
                  "albumName": "Wish You Were Here",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 3,
                  "releaseDate": "1975-09-12",
                  "durationInMillis": 307400,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100087",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "433938",
                      "textColor2": "25312d",
                      "textColor4": "515a57",
                      "textColor1": "140806",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters",
                  "url": "https://music.apple.com/us/album/have-a-cigar/1065973975?i=1065973979",
                  "playParams": {
                      "id": "1065973979",
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
                  "name": "Have a Cigar",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/48/89/89/48898913-2fb5-f15d-aff0-2b64ec2f95e3/mzaf_3385468281927428891.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065973980": {
              "id": "1065973980",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "Wish You Were Here",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 4,
                  "releaseDate": "1975-09-12",
                  "durationInMillis": 338467,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100088",
                  "artwork": {
                      "width": 1500,
                      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                      "height": 1500,
                      "textColor3": "433938",
                      "textColor2": "25312d",
                      "textColor4": "515a57",
                      "textColor1": "140806",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "composerName": "David Gilmour & Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980",
                  "playParams": {
                      "id": "1065973980",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Wish You Were Here",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/33/48/64/33486450-44e6-052b-7128-6855f89e181e/mzaf_926869419800832606.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065975636": {
              "id": "1065975636",
              "type": "songs",
              "attributes": {
                  "albumName": "The Wall",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 3,
                  "releaseDate": "1979-11-30",
                  "durationInMillis": 191293,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100097",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters",
                  "url": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-1/1065975633?i=1065975636",
                  "playParams": {
                      "id": "1065975636",
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
                  "name": "Another Brick In the Wall, Pt. 1",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/7f/0a/b2/7f0ab2de-c58f-ab90-aaa7-69e76ea1614e/mzaf_14153234638323867724.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065975638": {
              "id": "1065975638",
              "type": "songs",
              "attributes": {
                  "albumName": "The Wall",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 5,
                  "releaseDate": "1979-11-23",
                  "durationInMillis": 238947,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100099",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters",
                  "url": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638",
                  "playParams": {
                      "id": "1065975638",
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
                  "name": "Another Brick In the Wall, Pt. 2",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f8/a2/cd/f8a2cd4a-2af9-f34f-3684-89e3304c102c/mzaf_3024259169630460283.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065976152": {
              "id": "1065976152",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "The Wall",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 6,
                  "durationInMillis": 334880,
                  "releaseDate": "1979-11-30",
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100100",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/mother/1065975633?i=1065976152",
                  "playParams": {
                      "id": "1065976152",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Mother",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0a/fa/a1/0afaa116-5108-ebf2-f2b3-9d7e0afa9075/mzaf_6944276163671190323.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065976155": {
              "id": "1065976155",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "The Wall",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 9,
                  "releaseDate": "1979-11-30",
                  "durationInMillis": 209787,
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100103",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters & David Gilmour",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/young-lust/1065975633?i=1065976155",
                  "playParams": {
                      "id": "1065976155",
                      "kind": "song"
                  },
                  "discNumber": 1,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Young Lust",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/74/a1/61/74a1613a-0538-afd8-d425-b7e3a2d87815/mzaf_11226047340176135308.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065976163": {
              "id": "1065976163",
              "type": "songs",
              "attributes": {
                  "hasTimeSyncedLyrics": true,
                  "albumName": "The Wall",
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 1,
                  "durationInMillis": 279640,
                  "releaseDate": "1979-11-30",
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100108",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "composerName": "Roger Waters",
                  "audioLocale": "en-US",
                  "url": "https://music.apple.com/us/album/hey-you/1065975633?i=1065976163",
                  "playParams": {
                      "id": "1065976163",
                      "kind": "song"
                  },
                  "discNumber": 2,
                  "isAppleDigitalMaster": true,
                  "hasLyrics": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Hey You",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b9/fd/c8/b9fdc82e-07a0-56b7-40d2-ca30540b1516/mzaf_3460980456213298909.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          },
          "1065976170": {
              "id": "1065976170",
              "type": "songs",
              "attributes": {
                  "albumName": "The Wall",
                  "hasTimeSyncedLyrics": true,
                  "genreNames": [
                      "Rock",
                      "Music"
                  ],
                  "trackNumber": 6,
                  "durationInMillis": 382280,
                  "releaseDate": "1979-11-30",
                  "isVocalAttenuationAllowed": true,
                  "isMasteredForItunes": true,
                  "isrc": "GBN9Y1100113",
                  "artwork": {
                      "width": 1414,
                      "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                      "height": 1414,
                      "textColor3": "443435",
                      "textColor2": "150505",
                      "textColor4": "443737",
                      "textColor1": "150203",
                      "bgColor": "ffffff",
                      "hasP3": false
                  },
                  "audioLocale": "en-US",
                  "composerName": "Roger Waters & David Gilmour",
                  "url": "https://music.apple.com/us/album/comfortably-numb/1065975633?i=1065976170",
                  "playParams": {
                      "id": "1065976170",
                      "kind": "song"
                  },
                  "discNumber": 2,
                  "hasLyrics": true,
                  "isAppleDigitalMaster": true,
                  "audioTraits": [
                      "hi-res-lossless",
                      "lossless",
                      "lossy-stereo"
                  ],
                  "name": "Comfortably Numb",
                  "previews": [
                      {
                          "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fe/44/11/fe441140-ff52-28ef-d7c4-d87b3084d959/mzaf_16992442534158252100.plus.aac.ep.m4a"
                      }
                  ],
                  "artistName": "Pink Floyd"
              }
          }
      }
  }
}


const authorLatestReleaseData = {
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
              "isMasteredForItunes": true,
              "upc": "196589557414",
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
              "trackCount": 10,
              "isCompilation": false,
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
          }
      }
  ]
}

const authorTopSongsData = {
  "data": [
      {
          "id": "1065973980",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": true,
              "albumName": "Wish You Were Here",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 4,
              "releaseDate": "1975-09-12",
              "durationInMillis": 338467,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100088",
              "artwork": {
                  "width": 1500,
                  "url": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "433938",
                  "textColor2": "25312d",
                  "textColor4": "515a57",
                  "textColor1": "140806",
                  "bgColor": "ffffff",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "David Gilmour & Roger Waters",
              "url": "https://music.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980",
              "playParams": {
                  "id": "1065973980",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Wish You Were Here",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/33/48/64/33486450-44e6-052b-7128-6855f89e181e/mzaf_926869419800832606.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065976170",
          "type": "songs",
          "attributes": {
              "albumName": "The Wall",
              "hasTimeSyncedLyrics": true,
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 6,
              "releaseDate": "1979-11-30",
              "durationInMillis": 382280,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100113",
              "artwork": {
                  "width": 1414,
                  "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                  "height": 1414,
                  "textColor3": "443435",
                  "textColor2": "150505",
                  "textColor4": "443737",
                  "textColor1": "150203",
                  "bgColor": "ffffff",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters & David Gilmour",
              "url": "https://music.apple.com/us/album/comfortably-numb/1065975633?i=1065976170",
              "playParams": {
                  "id": "1065976170",
                  "kind": "song"
              },
              "discNumber": 2,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Comfortably Numb",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fe/44/11/fe441140-ff52-28ef-d7c4-d87b3084d959/mzaf_16992442534158252100.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065975638",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": true,
              "albumName": "The Wall",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 5,
              "releaseDate": "1979-11-23",
              "durationInMillis": 238947,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100099",
              "artwork": {
                  "width": 1414,
                  "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                  "height": 1414,
                  "textColor3": "443435",
                  "textColor2": "150505",
                  "textColor4": "443737",
                  "textColor1": "150203",
                  "bgColor": "ffffff",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters",
              "url": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638",
              "playParams": {
                  "id": "1065975638",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Another Brick In the Wall, Pt. 2",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f8/a2/cd/f8a2cd4a-2af9-f34f-3684-89e3304c102c/mzaf_3024259169630460283.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065973708",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": false,
              "albumName": "The Dark Side of the Moon",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 6,
              "releaseDate": "1973-03-01",
              "durationInMillis": 380080,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100081",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters",
              "url": "https://music.apple.com/us/album/money/1065973699?i=1065973708",
              "playParams": {
                  "id": "1065973708",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Money",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2c/27/18/2c271828-8eac-8fba-3f84-04de0ade8c8e/mzaf_1220942864668452409.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd",
              "contentRating": "explicit"
          }
      },
      {
          "id": "1065973706",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": true,
              "albumName": "The Dark Side of the Moon",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 4,
              "releaseDate": "1973-03-01",
              "durationInMillis": 422853,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100079",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters, David Gilmour, Nick Mason & Richard Wright",
              "url": "https://music.apple.com/us/album/time/1065973699?i=1065973706",
              "playParams": {
                  "id": "1065973706",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Time",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/8b/ed/da8bed67-d37d-eb79-d045-ab9b2770d945/mzaf_13544500942081182780.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065973704",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": true,
              "albumName": "The Dark Side of the Moon",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 2,
              "releaseDate": "1973-03-01",
              "durationInMillis": 169560,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100077",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters, Richard Wright & David Gilmour",
              "url": "https://music.apple.com/us/album/breathe-in-the-air/1065973699?i=1065973704",
              "playParams": {
                  "id": "1065973704",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Breathe (In the Air)",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e7/e0/d1/e7e0d14c-9f93-3c3d-3e3e-208b5e8a16bf/mzaf_13329552186963021712.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065976163",
          "type": "songs",
          "attributes": {
              "hasTimeSyncedLyrics": true,
              "albumName": "The Wall",
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 1,
              "releaseDate": "1979-11-30",
              "durationInMillis": 279640,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100108",
              "artwork": {
                  "width": 1414,
                  "url": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/{w}x{h}bb.jpg",
                  "height": 1414,
                  "textColor3": "443435",
                  "textColor2": "150505",
                  "textColor4": "443737",
                  "textColor1": "150203",
                  "bgColor": "ffffff",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters",
              "url": "https://music.apple.com/us/album/hey-you/1065975633?i=1065976163",
              "playParams": {
                  "id": "1065976163",
                  "kind": "song"
              },
              "discNumber": 2,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Hey You",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b9/fd/c8/b9fdc82e-07a0-56b7-40d2-ca30540b1516/mzaf_3460980456213298909.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065973707",
          "type": "songs",
          "attributes": {
              "albumName": "The Dark Side of the Moon",
              "hasTimeSyncedLyrics": false,
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 5,
              "releaseDate": "1973-03-01",
              "durationInMillis": 284413,
              "isVocalAttenuationAllowed": false,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100080",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Richard Wright & Clare Torry",
              "url": "https://music.apple.com/us/album/the-great-gig-in-the-sky/1065973699?i=1065973707",
              "playParams": {
                  "id": "1065973707",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "The Great Gig In the Sky",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/64/51/55/645155d0-6975-ccb8-09c4-e12e9c8142d6/mzaf_3110260876153319291.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065973709",
          "type": "songs",
          "attributes": {
              "albumName": "The Dark Side of the Moon",
              "hasTimeSyncedLyrics": false,
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 7,
              "releaseDate": "1973-03-01",
              "durationInMillis": 472627,
              "isVocalAttenuationAllowed": false,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100082",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters & Richard Wright",
              "url": "https://music.apple.com/us/album/us-and-them/1065973699?i=1065973709",
              "playParams": {
                  "id": "1065973709",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Us and Them",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a2/26/17/a2261784-3298-4f2f-311e-fc72efe12b28/mzaf_4214166784119572355.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      },
      {
          "id": "1065973711",
          "type": "songs",
          "attributes": {
              "albumName": "The Dark Side of the Moon",
              "hasTimeSyncedLyrics": true,
              "genreNames": [
                  "Rock",
                  "Music"
              ],
              "trackNumber": 9,
              "releaseDate": "1973-03-01",
              "durationInMillis": 230493,
              "isVocalAttenuationAllowed": true,
              "isMasteredForItunes": true,
              "isrc": "GBN9Y1100140",
              "artwork": {
                  "width": 1500,
                  "url": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/{w}x{h}bb.jpg",
                  "height": 1500,
                  "textColor3": "ccc000",
                  "textColor2": "f96424",
                  "textColor4": "c7501d",
                  "textColor1": "fff000",
                  "bgColor": "010101",
                  "hasP3": false
              },
              "audioLocale": "en-US",
              "composerName": "Roger Waters",
              "url": "https://music.apple.com/us/album/brain-damage/1065973699?i=1065973711",
              "playParams": {
                  "id": "1065973711",
                  "kind": "song"
              },
              "discNumber": 1,
              "isAppleDigitalMaster": true,
              "hasLyrics": true,
              "audioTraits": [
                  "hi-res-lossless",
                  "lossless",
                  "lossy-stereo"
              ],
              "name": "Brain Damage",
              "previews": [
                  {
                      "url": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/58/5b/bb/585bbb32-7f6f-d6fd-2470-e02d7414544e/mzaf_6036343664090771981.plus.aac.ep.m4a"
                  }
              ],
              "artistName": "Pink Floyd"
          }
      }
  ]
}*/
