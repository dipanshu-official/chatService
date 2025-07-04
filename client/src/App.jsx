import { useState } from 'react'
import ChatUI from './components/ChatUI'
import {BrowserRouter as Router ,Routes , Route} from "react-router-dom"
import AuthPages from './components/AuthPages'
import ProfilePage from './components/profilePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPages/>}/>
        <Route path='/chat' element={<ChatUI/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>


      </Routes>
      
    </Router>
  )
}

export default App
