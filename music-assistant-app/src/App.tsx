import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import PageLayout from 'features/Layout/PageLayout/PageLayout';
import { RecordingManagement } from 'features/RecordingManagement';
import { ResultContentManager } from 'features/ResultContentManagment';
import MessageContext from 'contexts/MessageContext';
import { HistoryRenderer } from 'features/HistoryRenderer';
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import { History, HistoryEntity } from 'features/HistoryRenderer/HistoryRenderer.types';

function App() {

  const [message, setMessage] = useState<React.ReactNode>('');
  const [history, setHistory] = useState<History>([]);
  
  return (
    <PageLayout>
      <MessageContext.Provider value={{
        message: message,
        setMessage: setMessage,
        clear: () => {setMessage('')}
      }}>
        <HistoryManipulationContext.Provider value={{
          pushToHistory: <T,>(entry: HistoryEntity<T>) => {
            setHistory(history.concat(...history, entry))
          },
          resetHistoryAndPush: <T,>(entry: HistoryEntity<T>) => {
            setHistory([entry])
          }
        }}>
          <RecordingManagement/>
          
          <ResultContentManager
            history={history}
            onBackButtonClick={() => {setHistory(history.slice(0, -1))}}
          />
        </HistoryManipulationContext.Provider>
      </MessageContext.Provider>
    </PageLayout>
  )
}

export default App
