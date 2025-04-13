'use client'

import { useState } from 'react'
import { generateThreads } from '@/app/actions/anthropic'

interface GenerateThreadsButtonProps {
  topics: any;
  setThreads: (threads: any) => void;
  setAnalysis: (analysis: any) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const GenerateThreadsButton = ({
  topics,
  setThreads,
  setError,
  setLoading,
  setAnalysis,
}: GenerateThreadsButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateThreads = async () => {
    if (isGenerating || !topics) return
    
    try {
      setIsGenerating(true)
      setLoading(true)
      setError(null)
      setThreads(null)
      setAnalysis(null)
      
      const data = await generateThreads(topics)
      
      if (!data.threads) {
        throw new Error('Invalid response format: threads missing')
      }

      setThreads(data.threads.map((thread: any) => thread.messages))
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerateThreads}
      disabled={!topics || isGenerating}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isGenerating || !topics ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Threads...' : 'Generate Threads'}
    </button>
  )
}

export default GenerateThreadsButton
