

import { URLString } from 'utils/genericTypes.types';
import styles from './SongRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';
import { SongAttributes } from 'utils/apis/shazam.types';
import { generateImgLinkFromShazam } from 'utils/browser';
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
    imgUrl: URLString;
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
      <img src={props.data.imgUrl as string}/>
      <div className={styles['ta-container']}>
        <div className={styles['title']}>{props.data.title}</div>
        <div className={styles['artist']}>{props.data.artist}</div>
      </div>
      {props.events?.onYtClick && <YtButton className={styles['yt-btn']} onClick={props.events?.onYtClick}/>}
    </div>
  );
}

SongRow.defaultProps = {};

export function songDataToAlbumRowProps(data: SongAttributes, events: SongRowEventsProps, options: SongRowOptionsProps): SongRowProps {

  return {
    data: {
      title: data.name,
      artist: data.artistName,
      imgUrl: generateImgLinkFromShazam(data.artwork.url, 256, 256),
    },
    events: events,
    options: options,
  }
}

export default SongRow;