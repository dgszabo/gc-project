'use client'

import { useState } from 'react'
import { analyzeChatThreads } from '@/app/actions/anthropic'
import { Message, Analysis } from '@/lib/schemas'

interface GenerateAnalysisButtonProps {
  threads: Message[][] | null;
  areaOfLaw: string;
  setAnalysis: (analysis: Analysis | null) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GenerateAnalysisButton = ({
  threads,
  areaOfLaw,
  setAnalysis,
  setError,
  isLoading,
  setIsLoading,
}: GenerateAnalysisButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAnalysis = async () => {
    if (isGenerating || !threads) return
    
    try {
      setIsGenerating(true)
      setIsLoading(true)
      setError(null)
      setAnalysis(null)
      
      const data = await analyzeChatThreads(threads as Message[][], areaOfLaw)
      
      if (!data) {
        throw new Error('Invalid response format: analysis missing')
      }

      setAnalysis(data as Analysis)
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
      onClick={handleGenerateAnalysis}
      disabled={!threads || isLoading}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${!threads || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Analysis...' : 'Generate Analysis'}
    </button>
  )
}

export default GenerateAnalysisButton
