

import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import styles from './HistoryRenderer.module.scss';
import { History } from './HistoryRenderer.types';
import { useState } from 'react';
import { GridLoader } from 'react-spinners';
import { isDarkMode } from 'utils/css/builders';
import { useContext } from 'react';

export type HistoryRendererProps = {
  history: History;
};

export const HistoryRenderer = (props: HistoryRendererProps) => {

  const rendererContext = useContext(HistoryRendererManipulationContext);

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
      
        <HistoryComponent {...historyComponentProps}></HistoryComponent>
    </>
  );
};

HistoryRenderer.defaultProps = {

};

export default HistoryRenderer;
