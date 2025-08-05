import React from 'react'
import {Users} from 'lucide-react';
function SidebarSkeleton() {
  const skeletonContacts = Array(8).fill(null) 
  return (
    <aside className='h-full w-20 lg:w-72 border-r flex flex-col transition-all duration-200'>
        <div> 
            <div> 
                <Users/>
                <span className='font-medium hidden lg:block'>Contacts</span> 
            </div>
        </div>

      
    </aside>
  )
}

export default SidebarSkeleton
