import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SingupPage from './pages/SingupPage';

function App() {
  return (
    <div>
      <Routes> 
        <Route path="/signup" element={<SingupPage/>}/>
      </Routes>
    </div>
  )
}

export default App
