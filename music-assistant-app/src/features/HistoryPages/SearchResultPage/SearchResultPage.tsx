import { useQuery } from 'react-query';
import { SHAZAM_API, checkForErrors } from 'utils/apis/shazam';
import { Collapse } from 'react-collapse';
import { SongRow } from '../components/SongRow';
import { buildCssClass } from 'utils/css/builders';

import styles from './SearchResultPage.module.scss'
import SwitchGroup from 'components/SwitchGroup/SwitchGroup';
import { useContext, useEffect, useState } from 'react';
import { ArtistRow } from '../components/ArtistRow';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import { generateYoutubeLink, getFirstChannel, getFirstVideo, getGenericYtButtonEventChannel, getGenericYtButtonEventVideo } from 'utils/youtube';
import { openNewTab } from 'utils/browser';
import { openErrorMessage } from 'components/ModalMessagesTypes/ErrorMessage';
import ModalSystemContext from 'contexts/ModalSystemContext';
import { ErrorMessage } from 'components/ErrorMesasge';
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import { AuthorInfoPage, AuthorInfoPageProps } from '../AuthorInfoPage';
import { SongInfoPage } from '../SongInfoPage';
import { ShazamDetectSongResponseBody } from 'utils/apis/shazam.types';

export type SearchResultPageProps = {
  term: string
};

export const SearchResultPage = (props: SearchResultPageProps) => {
  const historyRendererContext = useContext(HistoryRendererManipulationContext);
  const historyContext = useContext(HistoryManipulationContext);
  const modalSystem = useContext(ModalSystemContext)

  const [listComps, setListComponent] = useState<{songs: JSX.Element[], artists:JSX.Element[]}>({songs: [], artists: []});
  const [activeBtn, setActiveBtn] = useState<'songs' | 'artists'>('songs')
  
  const { status: searchStatus, data: searchResults } = useQuery({
    queryKey: ["shazamSearch", props.term],
    queryFn: SHAZAM_API.search.GET({}, { term: props.term }, null),
  });

  useEffect(() => {
    if (!searchResults || checkForErrors(searchResults)) {
        historyRendererContext.updateHistoryTitle('');
        return
    }
    const songs = searchResults.tracks.hits.map((t, i) => (
        <SongRow key={i + '_' + t.track.key} data={{title: t.track.title, artist: t.track.subtitle, imgUrl: t.track.images.coverart}}
        events={{
            onYtClick: getGenericYtButtonEventVideo(modalSystem, t.track.title + ' ' + t.track.subtitle),
            onRowClick: () => {
                historyContext.pushToHistory({
                    history: {
                      component: SongInfoPage<ShazamDetectSongResponseBody>,
                      props: {
                        //songKey: "157666207",
                        songKey: t.track.key,
                      },
                    },
                  });
            }
        }}
        ></SongRow>
    ));
    
    const artists = searchResults.artists.hits.map((a, i) => {
        //const [disabled, setDisabled] = useState(false);
        return (<ArtistRow key={i + '_' + a.artist.name} data={{name: a.artist.name, imgUrl: a.artist.avatar}}
        events={{
            onYtClick: getGenericYtButtonEventChannel(modalSystem, a.artist.name),
            onRowClick: () => {
                historyContext.pushToHistory({
                    history: {
                        component: AuthorInfoPage,
                        props: {adamid: a.artist.adamid},
                    }
                })
            }
        }}
        ></ArtistRow>)}
    );

    setListComponent({songs: songs, artists: artists});
    setActiveBtn('songs');
    historyRendererContext.updateHistoryTitle(`Znaleziono: ${songs.length} utworów, ${artists.length} autorów`);
  }, [searchResults]); 

  useEffect(() => {
    if (searchStatus === 'loading') historyRendererContext.showLoadingSpinner(true);
    else historyRendererContext.showLoadingSpinner(false);
  }, [searchStatus])
  
  return(
    <>{searchStatus === 'error' && <ErrorMessage>Nie znaleziono danych</ErrorMessage>}
      {searchStatus === 'success' && <><div>
        <SwitchGroup buttons={[
            {
                id: 'songs',
                content: 'Utwory',
                onClick: () => setActiveBtn('songs'),
            },
            {
                id: 'artists',
                content: 'Autorzy',
                onClick: () => setActiveBtn('artists'),
            }
        ]} activeBtn={activeBtn}/>
      </div>
      <div className={styles['list-container']}>
        {listComps[activeBtn]}
      </div></>}
    </>
  );
};

SearchResultPage.defaultProps = {};


export default SearchResultPage;

/*const searchResults = {
  "tracks": {
      "hits": [
          {
              "track": {
                  "layout": "5",
                  "type": "MUSIC",
                  "key": "5884043",
                  "title": "Comfortably Numb",
                  "subtitle": "Pink Floyd",
                  "share": {
                      "subject": "Comfortably Numb - Pink Floyd",
                      "text": "I used Shazam to discover Comfortably Numb by Pink Floyd.",
                      "href": "https://www.shazam.com/track/5884043/comfortably-numb",
                      "image": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "twitter": "I used @Shazam to discover Comfortably Numb by Pink Floyd.",
                      "html": "https://www.shazam.com/snippets/email-share/5884043?lang=en-US&country=US",
                      "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "snapchat": "https://www.shazam.com/partner/sc/track/5884043"
                  },
                  "images": {
                      "background": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "coverart": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "coverarthq": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "joecolor": "b:ffffffp:150203s:150505t:443435q:443737"
                  },
                  "hub": {
                      "type": "APPLEMUSIC",
                      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
                      "actions": [
                          {
                              "name": "apple",
                              "type": "applemusicplay",
                              "id": "1065976170"
                          },
                          {
                              "name": "apple",
                              "type": "uri",
                              "uri": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fe/44/11/fe441140-ff52-28ef-d7c4-d87b3084d959/mzaf_16992442534158252100.plus.aac.ep.m4a"
                          }
                      ],
                      "options": [
                          {
                              "caption": "OPEN",
                              "actions": [
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "applemusicopen",
                                      "uri": "https://music.apple.com/us/album/comfortably-numb/1065975633?i=1065976170&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  },
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "uri",
                                      "uri": "https://music.apple.com/us/album/comfortably-numb/1065975633?i=1065976170&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "open",
                                  "providername": "applemusic"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
                              "type": "open",
                              "listcaption": "Open in Apple Music",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "applemusic"
                          },
                          {
                              "caption": "BUY",
                              "actions": [
                                  {
                                      "type": "uri",
                                      "uri": "https://itunes.apple.com/us/album/comfortably-numb/1065975633?i=1065976170&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "buy",
                                  "providername": "itunes"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "type": "buy",
                              "listcaption": "Buy on iTunes",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "itunes"
                          }
                      ],
                      "providers": [
                          {
                              "caption": "Open in Spotify",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:spotify:searchdeeplink",
                                      "type": "uri",
                                      "uri": "spotify:search:Comfortably%20Numb%20Pink%20Floyd"
                                  }
                              ],
                              "type": "SPOTIFY"
                          },
                          {
                              "caption": "Open in Deezer",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/deezer-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/deezer_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:deezer:searchdeeplink",
                                      "type": "uri",
                                      "uri": "deezer-query://www.deezer.com/play?query=%7Btrack%3A%27Comfortably+Numb%27%20artist%3A%27Pink+Floyd%27%7D"
                                  }
                              ],
                              "type": "DEEZER"
                          }
                      ],
                      "explicit": false,
                      "displayname": "APPLE MUSIC"
                  },
                  "artists": [
                      {
                          "id": "42",
                          "adamid": "487143"
                      }
                  ],
                  "url": "https://www.shazam.com/track/5884043/comfortably-numb"
              }
          },
          {
              "track": {
                  "layout": "5",
                  "type": "MUSIC",
                  "key": "42040293",
                  "title": "Wish You Were Here",
                  "subtitle": "Pink Floyd",
                  "share": {
                      "subject": "Wish You Were Here - Pink Floyd",
                      "text": "I used Shazam to discover Wish You Were Here by Pink Floyd.",
                      "href": "https://www.shazam.com/track/42040293/wish-you-were-here",
                      "image": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/400x400cc.jpg",
                      "twitter": "I used @Shazam to discover Wish You Were Here by Pink Floyd.",
                      "html": "https://www.shazam.com/snippets/email-share/42040293?lang=en-US&country=US",
                      "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "snapchat": "https://www.shazam.com/partner/sc/track/42040293"
                  },
                  "images": {
                      "background": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "coverart": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/400x400cc.jpg",
                      "coverarthq": "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/49/ab/fe/49abfef6-0cd9-aa1f-05c3-3eb85d3fe3f5/886445635843.jpg/400x400cc.jpg",
                      "joecolor": "b:ffffffp:140806s:25312dt:433938q:515a57"
                  },
                  "hub": {
                      "type": "APPLEMUSIC",
                      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
                      "actions": [
                          {
                              "name": "apple",
                              "type": "applemusicplay",
                              "id": "1065973980"
                          },
                          {
                              "name": "apple",
                              "type": "uri",
                              "uri": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/33/48/64/33486450-44e6-052b-7128-6855f89e181e/mzaf_926869419800832606.plus.aac.ep.m4a"
                          }
                      ],
                      "options": [
                          {
                              "caption": "OPEN",
                              "actions": [
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "applemusicopen",
                                      "uri": "https://music.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  },
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "uri",
                                      "uri": "https://music.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "open",
                                  "providername": "applemusic"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
                              "type": "open",
                              "listcaption": "Open in Apple Music",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "applemusic"
                          },
                          {
                              "caption": "BUY",
                              "actions": [
                                  {
                                      "type": "uri",
                                      "uri": "https://itunes.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "buy",
                                  "providername": "itunes"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "type": "buy",
                              "listcaption": "Buy on iTunes",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "itunes"
                          }
                      ],
                      "providers": [
                          {
                              "caption": "Open in Spotify",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:spotify:searchdeeplink",
                                      "type": "uri",
                                      "uri": "spotify:search:Wish%20You%20Were%20Here%20Pink%20Floyd"
                                  }
                              ],
                              "type": "SPOTIFY"
                          },
                          {
                              "caption": "Open in Deezer",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/deezer-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/deezer_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:deezer:searchdeeplink",
                                      "type": "uri",
                                      "uri": "deezer-query://www.deezer.com/play?query=%7Btrack%3A%27Wish+You+Were+Here%27%20artist%3A%27Pink+Floyd%27%7D"
                                  }
                              ],
                              "type": "DEEZER"
                          }
                      ],
                      "explicit": false,
                      "displayname": "APPLE MUSIC"
                  },
                  "artists": [
                      {
                          "id": "42",
                          "adamid": "487143"
                      }
                  ],
                  "url": "https://www.shazam.com/track/42040293/wish-you-were-here"
              }
          },
          {
              "track": {
                  "layout": "5",
                  "type": "MUSIC",
                  "key": "283230",
                  "title": "Another Brick In the Wall, Pt. 2",
                  "subtitle": "Pink Floyd",
                  "share": {
                      "subject": "Another Brick In the Wall, Pt. 2 - Pink Floyd",
                      "text": "I used Shazam to discover Another Brick In the Wall, Pt. 2 by Pink Floyd.",
                      "href": "https://www.shazam.com/track/283230/another-brick-in-the-wall-pt-2",
                      "image": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "twitter": "I used @Shazam to discover Another Brick In the Wall, Pt. 2 by Pink Floyd.",
                      "html": "https://www.shazam.com/snippets/email-share/283230?lang=en-US&country=US",
                      "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "snapchat": "https://www.shazam.com/partner/sc/track/283230"
                  },
                  "images": {
                      "background": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "coverart": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "coverarthq": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "joecolor": "b:ffffffp:150203s:150505t:443435q:443737"
                  },
                  "hub": {
                      "type": "APPLEMUSIC",
                      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
                      "actions": [
                          {
                              "name": "apple",
                              "type": "applemusicplay",
                              "id": "1065975638"
                          },
                          {
                              "name": "apple",
                              "type": "uri",
                              "uri": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f8/a2/cd/f8a2cd4a-2af9-f34f-3684-89e3304c102c/mzaf_3024259169630460283.plus.aac.ep.m4a"
                          }
                      ],
                      "options": [
                          {
                              "caption": "OPEN",
                              "actions": [
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "applemusicopen",
                                      "uri": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  },
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "uri",
                                      "uri": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "open",
                                  "providername": "applemusic"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
                              "type": "open",
                              "listcaption": "Open in Apple Music",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "applemusic"
                          },
                          {
                              "caption": "BUY",
                              "actions": [
                                  {
                                      "type": "uri",
                                      "uri": "https://itunes.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "buy",
                                  "providername": "itunes"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "type": "buy",
                              "listcaption": "Buy on iTunes",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "itunes"
                          }
                      ],
                      "providers": [
                          {
                              "caption": "Open in Spotify",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:spotify:searchdeeplink",
                                      "type": "uri",
                                      "uri": "spotify:search:Another%20Brick%20In%20the%20Wall%2C%20Pt.%202%20Pink%20Floyd"
                                  }
                              ],
                              "type": "SPOTIFY"
                          },
                          {
                              "caption": "Open in Deezer",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/deezer-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/deezer_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:deezer:searchdeeplink",
                                      "type": "uri",
                                      "uri": "deezer-query://www.deezer.com/play?query=%7Btrack%3A%27Another+Brick+In+the+Wall%2C+Pt.+2%27%20artist%3A%27Pink+Floyd%27%7D"
                                  }
                              ],
                              "type": "DEEZER"
                          }
                      ],
                      "explicit": false,
                      "displayname": "APPLE MUSIC"
                  },
                  "artists": [
                      {
                          "id": "42",
                          "adamid": "487143"
                      }
                  ],
                  "url": "https://www.shazam.com/track/283230/another-brick-in-the-wall-pt-2"
              }
          },
          {
              "track": {
                  "layout": "5",
                  "type": "MUSIC",
                  "key": "222298",
                  "title": "Time",
                  "subtitle": "Pink Floyd",
                  "share": {
                      "subject": "Time - Pink Floyd",
                      "text": "I used Shazam to discover Time by Pink Floyd.",
                      "href": "https://www.shazam.com/track/222298/time",
                      "image": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/400x400cc.jpg",
                      "twitter": "I used @Shazam to discover Time by Pink Floyd.",
                      "html": "https://www.shazam.com/snippets/email-share/222298?lang=en-US&country=US",
                      "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "snapchat": "https://www.shazam.com/partner/sc/track/222298"
                  },
                  "images": {
                      "background": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "coverart": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/400x400cc.jpg",
                      "coverarthq": "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/3c/1b/a9/3c1ba9e1-15b1-03b3-3bfd-09dbd9f1705b/dj.mggvbaou.jpg/400x400cc.jpg",
                      "joecolor": "b:010101p:fff000s:f96424t:ccc000q:c7501d"
                  },
                  "hub": {
                      "type": "APPLEMUSIC",
                      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
                      "actions": [
                          {
                              "name": "apple",
                              "type": "applemusicplay",
                              "id": "1065973706"
                          },
                          {
                              "name": "apple",
                              "type": "uri",
                              "uri": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/da/8b/ed/da8bed67-d37d-eb79-d045-ab9b2770d945/mzaf_13544500942081182780.plus.aac.ep.m4a"
                          }
                      ],
                      "options": [
                          {
                              "caption": "OPEN",
                              "actions": [
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "applemusicopen",
                                      "uri": "https://music.apple.com/us/album/time/1065973699?i=1065973706&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  },
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "uri",
                                      "uri": "https://music.apple.com/us/album/time/1065973699?i=1065973706&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "open",
                                  "providername": "applemusic"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
                              "type": "open",
                              "listcaption": "Open in Apple Music",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "applemusic"
                          },
                          {
                              "caption": "BUY",
                              "actions": [
                                  {
                                      "type": "uri",
                                      "uri": "https://itunes.apple.com/us/album/time/1065973699?i=1065973706&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "buy",
                                  "providername": "itunes"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "type": "buy",
                              "listcaption": "Buy on iTunes",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "itunes"
                          }
                      ],
                      "providers": [
                          {
                              "caption": "Open in Spotify",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:spotify:searchdeeplink",
                                      "type": "uri",
                                      "uri": "spotify:search:Time%20Pink%20Floyd"
                                  }
                              ],
                              "type": "SPOTIFY"
                          },
                          {
                              "caption": "Open in Deezer",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/deezer-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/deezer_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:deezer:searchdeeplink",
                                      "type": "uri",
                                      "uri": "deezer-query://www.deezer.com/play?query=%7Btrack%3A%27Time%27%20artist%3A%27Pink+Floyd%27%7D"
                                  }
                              ],
                              "type": "DEEZER"
                          }
                      ],
                      "explicit": false,
                      "displayname": "APPLE MUSIC"
                  },
                  "artists": [
                      {
                          "id": "42",
                          "adamid": "487143"
                      }
                  ],
                  "url": "https://www.shazam.com/track/222298/time"
              }
          },
          {
              "track": {
                  "layout": "5",
                  "type": "MUSIC",
                  "key": "54371586",
                  "title": "Hey You",
                  "subtitle": "Pink Floyd",
                  "share": {
                      "subject": "Hey You - Pink Floyd",
                      "text": "I used Shazam to discover Hey You by Pink Floyd.",
                      "href": "https://www.shazam.com/track/54371586/hey-you",
                      "image": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "twitter": "I used @Shazam to discover Hey You by Pink Floyd.",
                      "html": "https://www.shazam.com/snippets/email-share/54371586?lang=en-US&country=US",
                      "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "snapchat": "https://www.shazam.com/partner/sc/track/54371586"
                  },
                  "images": {
                      "background": "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800cc.jpg",
                      "coverart": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "coverarthq": "https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/3c/b4/e3/3cb4e3d0-cd77-8f18-7465-d60e6949b435/886445635850.jpg/400x400cc.jpg",
                      "joecolor": "b:ffffffp:150203s:150505t:443435q:443737"
                  },
                  "hub": {
                      "type": "APPLEMUSIC",
                      "image": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic_{scalefactor}.png",
                      "actions": [
                          {
                              "name": "apple",
                              "type": "applemusicplay",
                              "id": "1065976163"
                          },
                          {
                              "name": "apple",
                              "type": "uri",
                              "uri": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b9/fd/c8/b9fdc82e-07a0-56b7-40d2-ca30540b1516/mzaf_3460980456213298909.plus.aac.ep.m4a"
                          }
                      ],
                      "options": [
                          {
                              "caption": "OPEN",
                              "actions": [
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "applemusicopen",
                                      "uri": "https://music.apple.com/us/album/hey-you/1065975633?i=1065976163&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  },
                                  {
                                      "name": "hub:applemusic:deeplink",
                                      "type": "uri",
                                      "uri": "https://music.apple.com/us/album/hey-you/1065975633?i=1065976163&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=music&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "open",
                                  "providername": "applemusic"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/overflow-open-option_{scalefactor}.png",
                              "type": "open",
                              "listcaption": "Open in Apple Music",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/applemusic-overflow_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "applemusic"
                          },
                          {
                              "caption": "BUY",
                              "actions": [
                                  {
                                      "type": "uri",
                                      "uri": "https://itunes.apple.com/us/album/hey-you/1065975633?i=1065976163&mttnagencyid=s2n&mttnsiteid=125115&mttn3pid=Apple-Shazam&mttnsub1=Shazam_ios&mttnsub2=5348615A-616D-3235-3830-44754D6D5973&itscg=30201&app=itunes&itsct=Shazam_ios"
                                  }
                              ],
                              "beacondata": {
                                  "type": "buy",
                                  "providername": "itunes"
                              },
                              "image": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "type": "buy",
                              "listcaption": "Buy on iTunes",
                              "overflowimage": "https://images.shazam.com/static/icons/hub/ios/v5/itunes-overflow-buy_{scalefactor}.png",
                              "colouroverflowimage": false,
                              "providername": "itunes"
                          }
                      ],
                      "providers": [
                          {
                              "caption": "Open in Spotify",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/spotify-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/spotify_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:spotify:searchdeeplink",
                                      "type": "uri",
                                      "uri": "spotify:search:Hey%20You%20Pink%20Floyd"
                                  }
                              ],
                              "type": "SPOTIFY"
                          },
                          {
                              "caption": "Open in Deezer",
                              "images": {
                                  "overflow": "https://images.shazam.com/static/icons/hub/ios/v5/deezer-overflow_{scalefactor}.png",
                                  "default": "https://images.shazam.com/static/icons/hub/ios/v5/deezer_{scalefactor}.png"
                              },
                              "actions": [
                                  {
                                      "name": "hub:deezer:searchdeeplink",
                                      "type": "uri",
                                      "uri": "deezer-query://www.deezer.com/play?query=%7Btrack%3A%27Hey+You%27%20artist%3A%27Pink+Floyd%27%7D"
                                  }
                              ],
                              "type": "DEEZER"
                          }
                      ],
                      "explicit": false,
                      "displayname": "APPLE MUSIC"
                  },
                  "artists": [
                      {
                          "id": "42",
                          "adamid": "487143"
                      }
                  ],
                  "url": "https://www.shazam.com/track/54371586/hey-you"
              }
          }
      ]
  },
  "artists": {
      "hits": [
          {
              "artist": {
                  "avatar": "https://is3-ssl.mzstatic.com/image/thumb/Features125/v4/06/4c/53/064c538b-3c05-253b-a31f-736559cfa28f/mza_8663860667383180418.png/800x800bb.jpg",
                  "name": "Pink Floyd",
                  "verified": false,
                  "weburl": "https://music.apple.com/us/artist/pink-floyd/487143",
                  "adamid": "487143"
              }
          },
          {
              "artist": {
                  "avatar": "https://is3-ssl.mzstatic.com/image/thumb/Features115/v4/a1/00/23/a1002387-359f-d0ca-c4cc-9b647cffc2a9/mzl.etpeotbe.jpg/800x800bb.jpg",
                  "name": "David Gilmour",
                  "verified": false,
                  "weburl": "https://music.apple.com/us/artist/david-gilmour/638538",
                  "adamid": "638538"
              }
          },
          {
              "artist": {
                  "avatar": "https://is4-ssl.mzstatic.com/image/thumb/Features125/v4/05/48/e6/0548e6ce-a8be-9d64-198c-8ee38913bd7b/mza_1502605118648709750.png/800x800bb.jpg",
                  "name": "Roger Waters",
                  "verified": false,
                  "weburl": "https://music.apple.com/us/artist/roger-waters/542658",
                  "adamid": "542658"
              }
          },
          {
              "artist": {
                  "avatar": "https://is5-ssl.mzstatic.com/image/thumb/Music113/v4/ca/19/69/ca19692f-4b2f-fbb8-6b83-e972951f6c2d/pr_source.png/800x800bb.jpg",
                  "name": "The Australian Pink Floyd Show",
                  "verified": false,
                  "weburl": "https://music.apple.com/us/artist/the-australian-pink-floyd-show/552999134",
                  "adamid": "552999134"
              }
          },
          {
              "artist": {
                  "avatar": "https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/ea/12/e5/ea12e5de-0ce5-c5c1-c7c1-0cf8ea464174/885686605974.jpg/800x800ac.jpg",
                  "name": "Pink Floyd Redux",
                  "verified": false,
                  "weburl": "https://music.apple.com/us/artist/pink-floyd-redux/272872968",
                  "adamid": "272872968"
              }
          }
      ]
  }
}*/
