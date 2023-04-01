import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import PageLayout from 'features/Layout/PageLayout/PageLayout';
import { RecordingManagement } from 'features/RecordingManagement';
import { ResultContentManager } from 'features/ResultContentManagment';
import MessageContext from 'contexts/MessageContext';
import { HistoryRenderer } from 'features/HistoryRenderer';
import HistoryRendererManipulationContext from 'contexts/HistoryRendereManipulationContext';
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
        <HistoryRendererManipulationContext.Provider value={{
          pushToHistory: (entry: HistoryEntity<any>) => {
            setHistory(history.concat(...history, entry))
          }
        }}>
          <RecordingManagement/>
          
          <ResultContentManager
            history={history}
            onBackButtonClick={() => {setHistory(history.slice(0, -1))}}
          />
        </HistoryRendererManipulationContext.Provider>
      </MessageContext.Provider>
    </PageLayout>
  )
}

export default App
