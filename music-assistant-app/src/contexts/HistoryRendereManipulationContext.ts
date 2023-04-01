import { HistoryEntity } from 'features/HistoryRenderer/HistoryRenderer.types';
import React from 'react';

export type HistoryRendererManipulationContextType = {
  pushToHistory: (entry: HistoryEntity<any>) => void;
}

export const HistoryRendererManipulationContext = React.createContext<HistoryRendererManipulationContextType>({
  pushToHistory: () => {},
})

export default HistoryRendererManipulationContext;