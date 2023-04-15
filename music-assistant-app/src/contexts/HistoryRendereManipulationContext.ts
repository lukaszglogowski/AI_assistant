import { HistoryEntity } from 'features/HistoryRenderer/HistoryRenderer.types';
import React from 'react';

export type HistoryRendererManipulationContextType = {
  pushToHistory: <T>(entry: HistoryEntity<T>) => void;
}

export const HistoryRendererManipulationContext = React.createContext<HistoryRendererManipulationContextType>({
  pushToHistory: () => {},
})

export default HistoryRendererManipulationContext;