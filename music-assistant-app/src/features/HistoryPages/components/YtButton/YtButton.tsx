import { IconButton, IconButtonProps } from 'components/IconButton';
import { AiFillYoutube } from 'react-icons/ai';

import styles from './YtButton.module.scss';

export type YtButtonProps = Omit<IconButtonProps, 'children'>

export const YtButton = (props: YtButtonProps) => {

  const p:YtButtonProps = {
    ...props,
  }

  return(
    <IconButton {...p}>
      <div className={styles['bg']}>
      </div>
      <AiFillYoutube className={styles['color']}/>
    </IconButton>
  );
};

YtButton.defaultProps = {};


export default YtButton;