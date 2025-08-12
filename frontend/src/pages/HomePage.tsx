import { useChatStore } from '@/store/useChatStore'
import React from 'react'
import ChatContainer from '@/components/ChatContainer'
import NoChatSelected from '@/components/NoChatSelected'
import SidebarComponent from '@/components/SidebarComponent'

function Home() {
  const { selectedUser } = useChatStore((state) => state)

  return (
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div className={`${selectedUser ? 'hidden lg:flex' : 'flex'}`}>
        <SidebarComponent />
      </div>
        
      {/* Chat Area - Takes remaining space */}
      <div className="flex-1">
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