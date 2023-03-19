import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import PageLayout from 'features/Layout/PageLayout/PageLayout';
import { RecordingManagement } from 'features/RecordingManagement';
import { ResultContentManager } from 'features/ResultContentManagment';

function App() {
  
  return (
    <PageLayout>
      <RecordingManagement></RecordingManagement>
      <ResultContentManager></ResultContentManager>
    </PageLayout>
  )
}

export default App
