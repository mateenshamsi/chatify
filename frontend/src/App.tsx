import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SingupPage from './pages/SingupPage';
import Login from './pages/LoginPage';
import { useAuthStore} from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import { HomePage, ProfilePage, SettingsPage,LoginPage,SignupPage } from './pages';
import Navbar from './components/Navbar';

function App() {
  const {authUser,checkAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
   const location = useLocation();
  const noNavbarRoutes = ['/login', '/signup'];

  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar/>}
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
