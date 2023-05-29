import {
  ShazamDetectSongResponseBody,
  ShazamSongInfoResponseBody,
  YoutubeSongInfoResponseBody,
} from "utils/apis/shazam.types";
import styles from "./SongInfoContent.module.scss";
import { url } from "inspector";
import React, { useContext } from "react";
import { AiFillYoutube } from "react-icons/ai";
import { convertMsToTime, formatDate, generateImgLinkFromShazam } from 'utils/browser';
import { YtButton } from '../YtButton';
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import ModalSystemContext from 'contexts/ModalSystemContext';
import { getGenericYtButtonEventVideo } from 'utils/youtube';
import { Button } from 'components/Button';
import { AuthorInfoPage } from 'features/HistoryPages/AuthorInfoPage';
import { AlbumInfoPage } from 'features/HistoryPages/AlbumInfoPage';
import { useQuery } from 'react-query';
import { SHAZAM_API, checkForErrors } from 'utils/apis/shazam';
import { SongRow, songDataToSongRowProps } from '../SongRow';
import { SongInfoPage } from 'features/HistoryPages/SongInfoPage';

export type SongInfoContentProps = {
  songDetails?: ShazamSongInfoResponseBody;
  songKey?: string;
};

export const SongInfoContent = (props: SongInfoContentProps) => {

  const historyRendererContext = useContext(HistoryRendererManipulationContext);
  const historyContext = useContext(HistoryManipulationContext)
  const modalSystem = useContext(ModalSystemContext)

  const { status: recomendationsStatus, data: recomendationsData } = useQuery({
    queryKey: ['songs-recomendations', props.songKey],
    queryFn: SHAZAM_API.songs.recomendations.GET({}, { key: props.songKey! }, null),
    enabled: !!props.songKey
  });

  if (!props.songDetails || props.songDetails?.data?.length == 0) {
    return <></>;
  }

  const data = props.songDetails.data[0]

  return (
    <>
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
            <YtButton onClick={getGenericYtButtonEventVideo(modalSystem, data.attributes.name + ' ' + data.attributes.artistName)}/>
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
          <Button onClick={() => {
            historyContext.pushToHistory({
              history: {
                  component: AlbumInfoPage,
                  props: {id: data.relationships.albums.data[0].id},
              }
            })
          }}>Album</Button>
        </div>
        <div className={styles['info-container']}>
          <div className={styles['info']}>
              <div><strong>Wydano: </strong>{formatDate(data.attributes.releaseDate)}</div>
          </div>
          <div className={styles['info']}>
              <div><strong>Kompozytor: </strong>{data.attributes.composerName}</div>
          </div>
          <div className={styles['info']}>
              <div><strong>Tytuł albumu: </strong>{data.attributes.albumName}</div>
          </div>
          <div className={styles['info']}>
              <div><strong>Czas trwania: </strong>{convertMsToTime(data.attributes.durationInMillis)}</div>
          </div>
        </div>
        {
          recomendationsData && recomendationsData?.tracks?.length > 0 && !checkForErrors(recomendationsData) && <div className={styles['recomendations-container']}>
            <div className={styles['header']}>
                Rekomendacje
              </div>
              <div className={styles['recomendations']}>
                {recomendationsData.tracks.map((t, i) => {
                  return (
                    <SongRow key={i + '_' + t.key}  
                      data={{title: t.title, artist: t.subtitle, imgUrl: t?.images?.coverart}}
                      events={{
                        onYtClick: getGenericYtButtonEventVideo(modalSystem, t.title + ' ' + t.subtitle),
                        onRowClick: () => {
                          historyContext.pushToHistory({
                            history: {
                              component: SongInfoPage<ShazamDetectSongResponseBody>,
                              props: {
                                //songKey: "157666207",
                                songKey: t.key,
                              },
                            },
                          });
                        }
                      }}
                    />
                  );
                })}
              </div>
          </div>
        }
      </div>
    </>
  );
};

SongInfoContent.defaultProps = {};

export default SongInfoContent;
