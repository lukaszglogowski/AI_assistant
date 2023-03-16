import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { CommandRecorder } from 'features/CommandRecorder';
import PageLayout from 'features/Layout/PageLayout/PageLayout';

function App() {
  
  return (
    <PageLayout>
      <CommandRecorder></CommandRecorder>
    </PageLayout>
  )
}

export default App
