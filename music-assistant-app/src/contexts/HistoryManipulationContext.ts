import { HistoryEntity } from 'features/HistoryRenderer/HistoryRenderer.types';
import React from 'react';

export type HistoryManipulationContextType = {
  pushToHistory: <T>(entry: HistoryEntity<T>) => void;
  resetHistoryAndPush: <T>(entr: HistoryEntity<T>) => void;
}

export const HistoryManipulationContext = React.createContext<HistoryManipulationContextType>({
  pushToHistory: () => {},
  resetHistoryAndPush: () => {},
})

export default HistoryManipulationContext;