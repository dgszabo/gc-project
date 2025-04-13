'use client'

import { useState } from 'react'

import { generateThreads as generateThreadsAnthropic } from '@/app/actions/anthropic'
import { generateThreads as generateThreadsOpenAI } from '@/app/actions/openai'
import { Analysis, Message, Topic } from '@/lib/schemas';

interface GenerateThreadsButtonProps {
  topics: Topic[];
  setThreads: (threads: Message[][] | null) => void;
  setAnalysis: (analysis: Analysis | null) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  model: string;
}

const GenerateThreadsButton = ({
  topics,
  setThreads,
  setError,
  isLoading,
  setIsLoading,
  setAnalysis,
  model,
}: GenerateThreadsButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateThreads = async () => {
    if (isGenerating || !topics) return
    
    try {
      setIsGenerating(true)
      setIsLoading(true)
      setError(null)
      setThreads(null)
      setAnalysis(null)
      
      const data = model === 'anthropic' ? await generateThreadsAnthropic(topics) : await generateThreadsOpenAI(topics)
      
      if (!data.threads) {
        throw new Error('Invalid response format: threads missing')
      }

      setThreads(data.threads.map((thread: any) => thread.messages))
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerateThreads}
      disabled={!topics || isLoading}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${!topics || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Threads...' : 'Generate Threads'}
    </button>
  )
}

export default GenerateThreadsButton
