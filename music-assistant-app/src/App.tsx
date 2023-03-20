import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import PageLayout from 'features/Layout/PageLayout/PageLayout';
import { RecordingManagement } from 'features/RecordingManagement';
import { ResultContentManager } from 'features/ResultContentManagment';
import MessageContext from 'contexts/MessageContext';

function App() {

  const [message, setMessage] = useState<React.ReactNode>('');
  
  return (
    <PageLayout>
      <MessageContext.Provider value={{
        message: message,
        setMessage: setMessage,
        clear: () => {setMessage('')}
      }}>
        <RecordingManagement></RecordingManagement>
        <ResultContentManager></ResultContentManager>
      </MessageContext.Provider>
    </PageLayout>
  )
}

export default App
