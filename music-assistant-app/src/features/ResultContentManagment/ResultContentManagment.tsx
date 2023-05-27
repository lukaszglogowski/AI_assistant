import { HistoryRenderer } from 'features/HistoryRenderer';
import React, { useEffect, useRef, useState } from 'react';

import styles from './ResultContentManagment.module.scss';
import { buildCssClass } from 'utils/css/builders';
import { IconButton } from 'components/IconButton';

import { MdKeyboardBackspace } from 'react-icons/md';
import { Divider } from 'components/Divider';
import { History } from 'features/HistoryRenderer/HistoryRenderer.types';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';

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
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('')

  const scrollable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollable.current) scrollable.current.scrollTop = 0;
  }, [props.history])

  return (
    <HistoryRendererManipulationContext.Provider value={{
      showLoadingSpinner: (v) => setIsLoading(v),
      isSpinnerVisible: isLoading,
      historyTitle: title,
      updateHistoryTitle: (t) => setTitle(t),
    }}>
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
            <span>{title}</span>
          </div>
        </div>
        <Divider/>
        <div className={styles['content']}>
          <div ref={scrollable} className={styles['scrollable']}>
          <HistoryRenderer history={props.history}/>
          </div>
        </div>
      </div>
    </HistoryRendererManipulationContext.Provider>
  );
}

ResultContentManager.defaultProps = {
 onBackButtonClick: () => {}
};

export default ResultContentManager;
