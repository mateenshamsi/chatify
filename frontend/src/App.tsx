import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SingupPage from './pages/SingupPage';
import Login from './pages/LoginPage';
import { useAuthStore} from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';


function App() {
  const {authUser,checkAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  return (
    <div>
     
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SingupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

    </div>
  )
}

export default App
