

import { URLString } from 'utils/genericTypes.types';
import styles from './ArtistRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';
import { ArtistAttributes } from 'utils/apis/shazam.types';
import { generateImgLinkFromShazam } from 'utils/browser';
import { buildCssClass } from 'utils/css/builders';

export type ArtistRowEventsProps = {
  onRowClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onYtClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export type ArtistRowOptionsProps = {
  dividers?: boolean;
}

export type ArtistRowProps = {
  data: {
    name: string;
    imgUrl: URLString;
  }
  events?: ArtistRowEventsProps;
  options?: ArtistRowOptionsProps;
};

export const ArtistRow = (props: ArtistRowProps) => {

  const containerCss = buildCssClass({
    [styles['container']]: true,
    [styles['clickable']]: !!props.events?.onRowClick,
    [styles['dividers']]: props.options?.dividers === undefined ? true : !!props.options?.dividers,
  })

  return(
    <div className={containerCss} onClick={props.events?.onRowClick}>
      <img src={props.data.imgUrl as string}/>
      <div className={styles['name']}>
        {props.data.name}
      </div>
      {props.events?.onYtClick && <YtButton className={styles['yt-btn']} onClick={props.events?.onYtClick}/>}
    </div>
  );
}

ArtistRow.defaultProps = {};

export function artistDataToAlbumRowProps(data: ArtistAttributes, events: ArtistRowEventsProps, options: ArtistRowOptionsProps): ArtistRowProps {

  return {
    data: {
      name: data.name,
      imgUrl: generateImgLinkFromShazam(data.artwork.url, 256, 256),
    },
    events: events,
    options: options,
  }
}

export default ArtistRow;