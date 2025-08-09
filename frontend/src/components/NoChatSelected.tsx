import { MessageSquare, Users } from 'lucide-react'
import React from 'react'

function NoChatSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="p-6 rounded-full bg-white shadow-lg border border-gray-200">
          <MessageSquare className="w-16 h-16 text-[#BC6C25]" />
        </div>
        
        {/* Floating Users Icon */}
        <div className="absolute -top-2 -right-2 p-2 rounded-full bg-[#DDA15E] shadow-md">
          <Users className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Welcome Content */}
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Chatify
        </h2>
        
        <p className="text-gray-600 leading-relaxed">
          Select a conversation from the sidebar to start messaging with your contacts. 
          Connect, share, and stay in touch with the people who matter most.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          <span className="px-3 py-1 bg-[#BC6C25]/10 text-[#BC6C25] rounded-full text-sm font-medium">
            Real-time messaging
          </span>
          <span className="px-3 py-1 bg-[#DDA15E]/10 text-[#BC6C25] rounded-full text-sm font-medium">
            Secure & private
          </span>
          <span className="px-3 py-1 bg-[#BC6C25]/10 text-[#BC6C25] rounded-full text-sm font-medium">
            Easy to use
          </span>
        </div>
      </div>

      {/* Subtle Animation */}
      <div className="mt-8 opacity-30">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#BC6C25] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#DDA15E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#BC6C25] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default NoChatSelected