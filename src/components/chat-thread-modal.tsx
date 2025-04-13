'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/core/dialog'
import { Message } from '@/lib/schemas';
import { PersonIcon, RocketIcon } from '@radix-ui/react-icons';

interface ChatThreadModalProps {
  title: string;
  messages?: Message[];
  isLoading: boolean;
}

const ChatThreadModal = ({ title, messages = [], isLoading }: ChatThreadModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={`dialog-${title.replace(/\s+/g, '-').toLowerCase()}`}
          disabled={!messages || messages.length === 0 || isLoading}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${!messages || messages.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
        >
          View Thread
        </button>
      </DialogTrigger>
      <DialogContent 
        id={`dialog-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="max-w-full w-full sm:max-w-[765px] max-h-[calc(100vh-2rem)] overflow-y-auto py-[40px] px-[32px]"
      >
        <DialogTitle className="text-2xl mb-6">
          {title}
        </DialogTitle>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-blue-50 ml-4' 
                  : 'bg-gray-50 mr-4'
              }`}
              role="article"
              aria-label={`Message from ${message.role}`}
            >
              <div className="flex justify-between mb-2">
                {message.role === 'user' && (
                  <div className="pt-2">
                    <PersonIcon className="h-6 w-6 text-gray-500 mr-4" />
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  {message.content}
                </span>
                {message.role === 'assistant' && (
                  <div className="pt-2">
                    <RocketIcon className="h-6 w-6 text-blue-500 ml-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatThreadModal
