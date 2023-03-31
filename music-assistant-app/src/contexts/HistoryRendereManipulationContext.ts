import { HistoryEntity } from 'features/HistoryRenderer/HistoryRendere.types';
import React from 'react';

export type HistoryRendererManipulationContextType = {
  pushToHistory: (entry: HistoryEntity) => void;
}

export const HistoryRendererManipulationContext = React.createContext<HistoryRendererManipulationContextType>({
  pushToHistory: () => {},
})

export default HistoryRendererManipulationContext;