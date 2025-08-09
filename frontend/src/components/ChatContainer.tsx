import React, { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { ArrowLeft, Send, MoreVertical, Phone, Video, Smile } from 'lucide-react'

function ChatContainer() {
  const { selectedUser, setSelectedUser } = useChatStore()
  const [message, setMessage] = useState('')

  // Mock messages - replace with your actual messages logic
  const messages = [
    {
      id: 1,
      text: "Hey! How are you doing today?",
      sender: selectedUser?.username,
      timestamp: "2:30 PM",
      isOwn: false
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some projects. How about you?",
      sender: "You",
      timestamp: "2:32 PM", 
      isOwn: true
    },
    {
      id: 3,
      text: "That sounds awesome! I'd love to hear more about what you're working on.",
      sender: selectedUser?.username,
      timestamp: "2:35 PM",
      isOwn: false
    },
    {
      id: 4,
      text: "Sure! I'll tell you all about it when we meet up. Are you free this weekend?",
      sender: "You",
      timestamp: "2:37 PM",
      isOwn: true
    }
  ]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // Add your send message logic here
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  if (!selectedUser) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedUser.profilePicture || '/default-avatar.png'}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              {/* Online status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {selectedUser.username}
              </h3>
              <p className="text-sm text-green-600">
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              msg.isOwn 
                ? 'bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] text-white' 
                : 'bg-white text-gray-900 border border-gray-200'
            } rounded-2xl px-4 py-3 shadow-sm`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`text-xs mt-2 ${
                msg.isOwn ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator (optional) */}
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows="1"
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#BC6C25] focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white transition-all duration-200"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            
            {/* Emoji button */}
            <button 
              type="button"
              className="absolute right-3 bottom-3 p-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              message.trim() 
                ? 'bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] text-white shadow-md hover:shadow-lg hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Quick actions (optional) */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer