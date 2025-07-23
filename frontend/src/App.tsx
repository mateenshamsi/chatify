import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SingupPage from './pages/SingupPage';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Routes> 
        <Route path="/signup" element={<SingupPage/>}/>
        <Route path="/login" element={<Login/>}/>

      </Routes>
    </div>
  )
}

export default App
