import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { CommandRecorder } from 'features/CommandRecorder';

function App() {
  
  return (
    <div className="App">
      <div className="card">
        {false && <button onClick={() => {}}>
          Click me
        </button>}
        <CommandRecorder></CommandRecorder>
      </div>
    </div>
  )
}

export default App
