import React from 'react';

export type HistoryRendererManipulationContextType = {
  showLoadingSpinner: (boolean: boolean) => void;
  isSpinnerVisible: boolean;
  historyTitle: string;
  updateHistoryTitle: (title: string) => void;
}

export const HistoryRendererManipulationContext = React.createContext<HistoryRendererManipulationContextType>({
  showLoadingSpinner: () => {},
  isSpinnerVisible: false,
  historyTitle: '',
  updateHistoryTitle: () => {},
})

export default HistoryRendererManipulationContext;