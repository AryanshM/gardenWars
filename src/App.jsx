import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PhaserGame from './phaser/PhaserGame'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <PhaserGame/>
    </>
  )
}

export default App
