import { LogOut, MessageSquare, SettingsIcon, UserCircle2 } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

function Navbar() {
  const { logout, authUser } = useAuthStore()
  return (
    <div className='m-4 container mx-auto flex justify-between items-center p-4 rounded-lg shadow-md'>
      {/* Left side - Logo */}
      <Link to="/" className="text-2xl font-bold text-[#BC6C25] flex items-center gap-4">
        <div className="p-3 rounded-2xl w-fit bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] shadow-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <span className="text-[#DDA15E]">Chatify</span>
      </Link>

      {/* Right side - Icons */}
      <div className="flex items-center gap-4">
        <Link to="/settings" className="text-2xl font-bold text-[#BC6C25] flex items-center gap-2">
          <div className="p-3 rounded-2xl w-fit bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] shadow-lg">
            <SettingsIcon className="size-5 text-white" />
          </div>
        </Link>

        {authUser && (
         <div className='flex gap-2'> 
         <Link to="/profile" className="text-2xl font-bold text-[#BC6C25] flex items-center gap-2">
            <div className="p-3 rounded-2xl w-fit bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] shadow-lg">
              <UserCircle2 className="size-5 text-white" />
            </div>
          </Link>
            <Button onClick={logout} className="text-2xl font-bold text-[#BC6C25] flex items-center gap-2">
            <div className="p-3 rounded-2xl w-fit bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] shadow-lg">
              <LogOut className="size-5 text-white" />
            </div>
          </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
