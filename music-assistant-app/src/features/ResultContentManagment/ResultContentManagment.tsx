import { HistoryRenderer } from 'features/HistoryRenderer';
import React from 'react';

import styles from './ResultContentManagment.module.scss';
import { buildCssClass } from 'utils/css/builders';
import { IconButton } from 'components/IconButton';

import { MdKeyboardBackspace } from 'react-icons/md';
import { Divider } from 'components/Divider';
import { History } from 'features/HistoryRenderer/HistoryRendere.types';

export type ResultContentManagerProps = {
  history: History
  onBackButtonClick?: () => void;
};

const containerClassObj = buildCssClass({
  [styles['content-box']]: true,
  [styles['content-box-style']]: true,
  [styles['content-box-sizing']]: true,
  [styles['content-box-positioning']]: true,
  [styles['content-box-layout']]: true,
})

export const ResultContentManager = (props: ResultContentManagerProps) => {

  return (
    <div className={containerClassObj}>
      <div className={styles['header']}>
        <IconButton
          emptySpaceSize={50}
          onClick={props.onBackButtonClick}
          disabled={props.history.length < 2}
        >
          <MdKeyboardBackspace/>
        </IconButton>
        <div className={styles['title']}>
          title
        </div>
      </div>
      <Divider/>
      <HistoryRenderer history={history}/>
    </div>
  );
}

ResultContentManager.defaultProps = {
 onBackButtonClick: () => {}
};

export default ResultContentManager;
