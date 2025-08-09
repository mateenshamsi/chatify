import { useChatStore } from '@/store/useChatStore'
import React from 'react'
import ChatContainer from '@/components/ChatContainer'
import NoChatSelected from '@/components/NoChatSelected'
import SidebarComponent from '@/components/SidebarComponent'

function Home() {
  const { selectedUser } = useChatStore((state) => state)

  return (
    <div className="h-full flex bg-gray-50 overflow-hidden">
      {/* Users List - Hidden on mobile when chat is selected */}
      <div className={`${selectedUser ? 'hidden lg:flex' : 'flex'} shrink-0`}>
        <SidebarComponent />
      </div>
        
      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedUser ? (
          <div className="hidden lg:flex flex-col justify-center items-center h-full">
            <NoChatSelected />
          </div>
        ) : (
          <ChatContainer />
        )}
      </div>
    </div>
  )
}

export default Home