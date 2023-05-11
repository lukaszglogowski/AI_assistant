

import { URLString } from 'utils/genericTypes.types';
import styles from './SongRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';

export type SongRowProps = {
  title: string;
  artist: string;
  imgUrl: URLString;
  onYtClick?: (event: React.MouseEvent<HTMLElement>) => void;
} & OnClickProps;

export const SongRow = (props: SongRowProps) => {
  return(
    <div className={styles['container']}>
      <img src={props.imgUrl as string}/>
      <div className={styles['ta-container']}>
        <div className={styles['title']}>{props.title}</div>
        <div className={styles['artist']}>{props.artist}</div>
      </div>
      <YtButton className={styles['yt-btn']} onClick={props.onYtClick}/>
    </div>
  );
}

SongRow.defaultProps = {};

export default SongRow;