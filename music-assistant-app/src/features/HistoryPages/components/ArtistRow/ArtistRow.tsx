

import { URLString } from 'utils/genericTypes.types';
import styles from './ArtistRow.module.scss';
import { YtButton } from '../YtButton';
import { OnClickProps } from 'utils/propsTypes';

export type ArtistRowProps = {
  name: string;
  imgUrl: URLString;
  btnDisabled?: boolean;
  onYtClick?: (event: React.MouseEvent<HTMLElement>) => void;
} & OnClickProps;

export const ArtistRow = (props: ArtistRowProps) => {
  return(
    <div className={styles['container']}>
      <img src={props.imgUrl as string}/>
      <div className={styles['name']}>
        {props.name}
      </div>
      <YtButton disabled={props.btnDisabled} className={styles['yt-btn']} onClick={props.onYtClick}/>
    </div>
  );
}

ArtistRow.defaultProps = {};

export default ArtistRow;