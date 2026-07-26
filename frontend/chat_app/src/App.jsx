import React from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom" 
import Homepage from './pages/Homepage'
import Chatpage from './pages/Chatpage'
import AdminPanel from './pages/AdminPanel'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className='App'>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/chats" element={<Chatpage/>} />
        <Route path="/admin" element={<AdminPanel />} />
    </Routes>

    </div>
  )
}

export default App