'use client'

import { useState } from 'react'
import { generateTopics } from '@/app/actions/anthropic'

interface GenerateTopicsButtonProps {
  areaOfLaw: string;
  setTopics: (topics: any) => void;
  setThreads: (threads: any) => void;
  setAnalysis: (analysis: any) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GenerateTopicsButton = ({
  areaOfLaw,
  setTopics,
  setError,
  isLoading,
  setIsLoading,
  setThreads,
  setAnalysis,
}: GenerateTopicsButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateTopics = async () => {
    if (isGenerating) return
    
    try {
      setIsGenerating(true)
      setIsLoading(true)
      setError(null)
      setTopics(null)
      setThreads(null)
      setAnalysis(null)
      
      const data = await generateTopics(areaOfLaw)
      
      if (!data.topics) {
        throw new Error('Invalid response format: topics missing')
      }

      setTopics(data.topics)
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
      onClick={handleGenerateTopics}
      disabled={isLoading}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Topics...' : 'Generate Topics'}
    </button>
  )
}

export default GenerateTopicsButton
