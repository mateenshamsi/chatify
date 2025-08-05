import { useChatStore } from '@/store/useChatStore'
import { Sidebar } from 'lucide-react';
import React from 'react'
import ChatContainer from '@/components/ChatContainer';
import NoChatSelected from '@/components/NoChatSelected';
function Home() {
  const {selectedUser} = useChatStore((state) => state);
  return (
    <div className='h-screen '>
      <div className='flex items-center justify-center pt-20 px-4'>
       <div>
          <div className='rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
            <div className='flex h-full rounded-lg overflow-hidden'>
              <Sidebar/> 
              {!selectedUser ? <NoChatSelected/>:<ChatContainer/>}
            </div>

          </div>
       </div>
      </div>
      
    </div>
  )
}

export default Home
