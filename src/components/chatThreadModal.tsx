'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import { Message } from '@/lib/schemas';
import { PersonIcon, RocketIcon } from '@radix-ui/react-icons';

interface ChatThreadModalProps {
  title: string;
  messages?: Message[];
}

const ChatThreadModal = ({ title, messages = [] }: ChatThreadModalProps) => {
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
          disabled={!messages || messages.length === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          View Thread
        </button>
      </DialogTrigger>
      <DialogContent 
        id={`dialog-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="max-w-full w-full sm:max-w-[765px] max-h-full overflow-y-auto py-[40px] px-[32px]"
        aria-labelledby={`dialog-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div>
          <h1 
            id={`dialog-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-2xl mb-6"
          >
            {title}
          </h1>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatThreadModal
