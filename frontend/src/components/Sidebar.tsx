import { useChatStore } from '@/store/useChatStore'
import React, { useEffect } from 'react'
import SidebarSkeleton from '@/components/skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { AvatarFallback } from './ui/avatar';

function Sidebar() {
  const {users,getUsers,setSelectedUser,isUsersLoading} = useChatStore() 
  const onlineUsers = []
  useEffect(()=>{
    getUsers();
  },[getUsers]) 
    if(isUsersLoading) {
        return <SidebarSkeleton/>;
    } 
    return (
    <aside className='h-full w-20 lg:w-72 border-r flex flex-col transition-all duration-200'> 
        <div className='border-b border-base-300 w-full p-5'>
            <div className='flex items-center gap-2'>
                <Users className="size-6"/> 
                <span className='font-medium hidden lg:block'>Contacts</span>
            </div> 
        
        </div>
        <div className='overflow-y-auto w-full py-3'>
            <div className='flex flex-col gap-2 px-2'>
                {users.map((user) => (
                    <button 
                        key={user._id} 
                        className='w-full p-3 flex items-center gap-3 '
                        onClick={() => setSelectedUser(user)}
                    >
                        <div className='relative mx-auto lg:mx-0'>
                            <img 
                                src={user.profilePicture || <AvatarFallback/>} 
                                alt={user.name} 
                                className='w-10 h-10 rounded-full object-cover'
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
                            )}

                        </div>
                    
                    </button>                   
                ))}
            </div>
        </div> 
      
    </aside>
  )
}

export default Sidebar
