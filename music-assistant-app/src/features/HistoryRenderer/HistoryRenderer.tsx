

import styles from './HistoryRemderer.module.scss';
import { History } from './HistoryRenderer.types';

export type HistoryRendererProps = {
  history: History;
};

export const HistoryRenderer = (props: HistoryRendererProps) => {

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
      <HistoryComponent {...historyComponentProps}></HistoryComponent>
    </>
  );
};

HistoryRenderer.defaultProps = {

};

export default HistoryRenderer;
