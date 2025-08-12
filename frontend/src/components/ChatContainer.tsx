import React, { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react'
import MessageInput from './MessageInput'
import { Message } from '@/store/useChatStore'

function ChatContainer() {
  const { selectedUser, setSelectedUser, messages, getMessages, sendMessage, isMessagesLoading } = useChatStore()
  const [message, setMessage] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || !selectedUser) return
    await sendMessage({ text: msgText })
    setMessage('')
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser, getMessages])

  if (!selectedUser) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedUser.profilePicture || '/default-avatar.png'}
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{selectedUser.username}</h3>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
        </div>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC6C25]"></div>
          </div>
        ) : (
          <>
            {messages.map((msg: Message) => (
              <div key={msg._id} className={`flex ${msg.senderId === selectedUser._id ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  msg.senderId === selectedUser._id
                    ? 'bg-white text-gray-900 border border-gray-200'
                    : 'bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] text-white'
                } rounded-2xl px-4 py-3 shadow-sm`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`text-xs mt-2 ${msg.senderId === selectedUser._id ? 'text-gray-500' : 'text-gray-200'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default ChatContainer
