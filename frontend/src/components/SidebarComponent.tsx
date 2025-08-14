import React, { useEffect, useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Search, User, X } from 'lucide-react'

export default function SidebarComponent() {
  const { users, getUsers, setSelectedUser, selectedUser, isUserLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getUsers()
  }, [getUsers])

  useEffect(() => {
    // Refresh users when onlineUsers changes to update their online status
    getUsers()
  }, [onlineUsers, getUsers])

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-80 lg:w-96 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#BC6C25]" />
            Chats
          </h2>
          {/* Mobile back button when user is selected */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSelectedUser(null)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BC6C25] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {isUserLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC6C25] mx-auto mb-2"></div>
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No users found' : 'No conversations yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <UserItem
                  key={user._id || user.username}
                  user={user}
                  isSelected={getIsUserSelected(user, selectedUser)}
                  onClick={() => setSelectedUser(user)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// Fixed selection logic function
function getIsUserSelected(user: any, selectedUser: any) {
  if (!selectedUser) return false
  
  // Prioritize ID comparison if both users have IDs
  if (user._id && selectedUser._id) {
    return user._id === selectedUser._id
  }
  
  // Fallback to username comparison if IDs are not available
  if (user.username && selectedUser.username) {
    return user.username === selectedUser.username
  }
  
  return false
}

// Separate UserItem component for better organization
function UserItem({ user, isSelected, onClick }: { user: any; isSelected: boolean; onClick: () => void }) {
  const { onlineUsers } = useAuthStore()
  // Determine if user is online based on onlineUsers array
  const isOnline = onlineUsers.includes(user._id)
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left hover:shadow-sm ${
        isSelected 
          ? 'bg-[#BC6C25] text-white shadow-md transform scale-[1.02]' 
          : 'hover:bg-gray-50 text-gray-900 hover:border-gray-200 border border-transparent'
      }`}
    >
      {/* Profile Picture with Online Status */}
      <div className="relative">
        <img
          src={user.profilePicture || '/default-avatar.png'}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        )}
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className={`font-semibold truncate ${
            isSelected ? 'text-white' : 'text-gray-900'
          }`}>
            {user.username}
          </p>
          <span className={`text-xs ${
            isSelected ? 'text-gray-200' : 'text-gray-500'
          }`}>
            {user.lastMessageTime || '2m'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${
            isSelected ? 'text-gray-200' : 'text-gray-600'
          }`}>
            {user.lastMessage || 'No messages yet'}
          </p>
          
          {/* Unread message indicator (if you have unread count) */}
          {user.unreadCount > 0 && !isSelected && (
            <span className="bg-[#BC6C25] text-white text-xs rounded-full px-2 py-0.5 ml-2 min-w-[1.25rem] text-center">
              {user.unreadCount > 99 ? '99+' : user.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}