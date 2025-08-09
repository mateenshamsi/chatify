import { Home, LogOut, MessageSquare, Settings, UserCircle2 } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'

function Navbar() {
  const { logout, authUser } = useAuthStore()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-col h-full w-full bg-white border-r border-gray-200 shadow-sm">
      
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] shadow-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#BC6C25]">Chatify</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {/* Home */}
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              isActive("/") 
                ? "bg-[#BC6C25] text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100 hover:text-[#BC6C25]"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              isActive("/settings") 
                ? "bg-[#BC6C25] text-white shadow-md" 
                : "text-gray-700 hover:bg-gray-100 hover:text-[#BC6C25]"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>

          {/* Profile */}
          {authUser && (
            <Link
              to="/profile"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive("/profile") 
                  ? "bg-[#BC6C25] text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#BC6C25]"
              }`}
            >
              <UserCircle2 className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </Link>
          )}
        </nav>
      </div>

      {/* User Section & Logout */}
      {authUser && (
        <div className="p-4 border-t border-gray-200">
          {/* User Info */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 mb-3">
            <img
              src={authUser.profilePicture || '/default-avatar.png'}
              alt={authUser.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#DDA15E]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {authUser.username || 'User'}
              </p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <Button
            onClick={logout}
            className="flex items-center justify-center gap-2 p-3 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Navbar