

import { URLString } from 'utils/genericTypes.types';
import styles from './SongRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';
import { SongAttributes } from 'utils/apis/shazam.types';
import { NO_PHOTO_URL, generateImgLinkFromShazam } from 'utils/browser';
import { buildCssClass } from 'utils/css/builders';

export type SongRowEventsProps = {
  onRowClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onYtClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export type SongRowOptionsProps = {
  dividers?: boolean;
}

export type SongRowProps = {
  data: {
    title: string;
    artist: string;
    imgUrl?: URLString;
  }
  events?: SongRowEventsProps;
  options?: SongRowOptionsProps;
};

export const SongRow = (props: SongRowProps) => {

  const containerCss = buildCssClass({
    [styles['container']]: true,
    [styles['clickable']]: !!props.events?.onRowClick,
    [styles['dividers']]: props.options?.dividers === undefined ? true : !!props.options?.dividers,
  })

  return(
    <div className={containerCss} onClick={props.events?.onRowClick}>
      <img src={(props.data.imgUrl || NO_PHOTO_URL) as string}/>
      <div className={styles['ta-container']}>
        <div className={styles['title']}>{props.data.title}</div>
        <div className={styles['artist']}>{props.data.artist}</div>
      </div>
      {props.events?.onYtClick && <YtButton className={styles['yt-btn']} onClick={(e) => {
        e.stopPropagation();
        props.events?.onYtClick && props.events?.onYtClick(e)
      }}/>}
    </div>
  );
}

SongRow.defaultProps = {};

export function songDataToSongRowProps(data: SongAttributes, events: SongRowEventsProps, options: SongRowOptionsProps): SongRowProps {

  return {
    data: {
      title: data.name,
      artist: data.artistName,
      imgUrl: !!data?.artwork?.url ? generateImgLinkFromShazam(data.artwork.url, 256, 256) : undefined,
    },
    events: events,
    options: options,
  }
}

export default SongRow;