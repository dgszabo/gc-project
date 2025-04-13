'use client'

import { useState } from 'react'
import { generateTopics } from '@/app/actions/anthropic'

interface GenerateTopicsButtonProps {
  areaOfLaw: string;
  setTopics: (topics: any) => void;
  setThreads: (threads: any) => void;
  setAnalysis: (analysis: any) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const GenerateTopicsButton = ({
  areaOfLaw,
  setTopics,
  setError,
  setLoading,
  setThreads,
  setAnalysis,
}: GenerateTopicsButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateTopics = async () => {
    if (isGenerating) return
    
    try {
      setIsGenerating(true)
      setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerateTopics}
      disabled={isGenerating}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Topics...' : 'Generate Topics'}
    </button>
  )
}

export default GenerateTopicsButton
