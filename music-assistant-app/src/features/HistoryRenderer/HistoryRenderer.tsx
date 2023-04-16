

import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import styles from './HistoryRenderer.module.scss';
import { History } from './HistoryRenderer.types';
import { useState } from 'react';
import { GridLoader } from 'react-spinners';
import { buildCssClass, isDarkMode } from 'utils/css/builders';
import { useContext } from 'react';

export type HistoryRendererProps = {
  history: History;
};

export const HistoryRenderer = (props: HistoryRendererProps) => {

  const rendererContext = useContext(HistoryRendererManipulationContext);

  const contentCss = buildCssClass({
    [styles['history-content']]: true,
    [styles['hide-content']]: rendererContext.isSpinnerVisible,
  })

  if (props.history.length <= 0) {
    return (
      <>
      </>
    );
  }

  const {history: {
    component: HistoryComponent,
    props: historyComponentProps,
  }} = props.history[props.history.length - 1];

  return (
    <>
      {rendererContext.isSpinnerVisible && <div className={styles['loading-container']}>
          <GridLoader color={isDarkMode() ? 'white' : '#242424'}/>
        </div>
      }
      <div className={contentCss}>
        <HistoryComponent {...historyComponentProps}></HistoryComponent>
      </div>
    </>
  );
};

HistoryRenderer.defaultProps = {

};

export default HistoryRenderer;
