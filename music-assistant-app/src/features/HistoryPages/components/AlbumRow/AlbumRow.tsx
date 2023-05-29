

import { URLString } from 'utils/genericTypes.types';
import styles from './AlbumRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';
import { AlbumAttributes } from 'utils/apis/shazam.types';
import { generateYoutubeLink, getFirstChannel } from 'utils/youtube';
import { openErrorMessage } from 'components/ModalMessagesTypes/ErrorMessage';
import { NO_PHOTO_URL, generateImgLinkFromShazam } from 'utils/browser';
import { buildCssClass } from 'utils/css/builders';

export type AlbumRowEventsProps = {
  onRowClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onYtClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export type AlbumRowOptionsProps = {
  dividers?: boolean;
}

export type AlbumRowProps = {
  data: {
    name: string;
    artist: string;
    imgUrl?: URLString;
    genreNames: string[];
    releaseDate: string;
    trackCount: number;
  }
  events?: AlbumRowEventsProps;
  options?: AlbumRowOptionsProps;
};

export const AlbumRow = (props: AlbumRowProps) => {
  const containerCss = buildCssClass({
    [styles['container']]: true,
    [styles['clickable']]: !!props.events?.onRowClick,
    [styles['dividers']]: props.options?.dividers === undefined ? true : !!props.options?.dividers,
  })

  return(
    <div className={containerCss} onClick={props.events?.onRowClick}>
      <img src={(props.data.imgUrl || NO_PHOTO_URL) as string}/>
      <div className={styles['ta-container']}>
        <div className={styles['title']}>{props.data.name}</div>
        <div className={styles['artist']}>{props.data.artist}</div>
      </div>
      {props.events?.onYtClick && <YtButton className={styles['yt-btn']} onClick={(e) => {
        e.stopPropagation();
        props.events?.onYtClick && props.events?.onYtClick(e)
      }}/>}
    </div>
  );
}

AlbumRow.defaultProps = {};

export function albumDataToAlbumRowProps(data: AlbumAttributes, events: AlbumRowEventsProps, options: AlbumRowOptionsProps): AlbumRowProps {

  return {
    data: {
      name: data.name,
      artist: data.artistName,
      imgUrl: !!data?.artwork?.url ? generateImgLinkFromShazam(data.artwork.url, 256, 256) : undefined,
      genreNames: data.genreNames,
      releaseDate: data.releaseDate,
      trackCount: data.trackCount,
    },
    events: events,
    options: options,
  }
}

export default AlbumRow;