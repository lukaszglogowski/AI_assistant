import React from 'react';

export type HistoryRendererManipulationContextType = {
  showLoadingSpinner: (boolean: boolean) => void;
  isSpinnerVisible: boolean;
}

export const HistoryRendererManipulationContext = React.createContext<HistoryRendererManipulationContextType>({
  showLoadingSpinner: () => {},
  isSpinnerVisible: false,
})

export default HistoryRendererManipulationContext;