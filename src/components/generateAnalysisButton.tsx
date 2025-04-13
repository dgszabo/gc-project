'use client'

import { useState } from 'react'
import { analyzeChatThreads } from '@/app/actions/anthropic'
import { Message, Analysis } from '@/lib/schemas'

interface GenerateAnalysisButtonProps {
  threads: Message[][] | null;
  areaOfLaw: string;
  setAnalysis: (analysis: Analysis | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const GenerateAnalysisButton = ({
  threads,
  areaOfLaw,
  setAnalysis,
  setError,
  setLoading,
}: GenerateAnalysisButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAnalysis = async () => {
    if (isGenerating || !threads) return
    
    try {
      setIsGenerating(true)
      setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerateAnalysis}
      disabled={!threads || isGenerating}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isGenerating || !threads ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'}`}
    >
      {isGenerating ? 'Generating Analysis...' : 'Generate Analysis'}
    </button>
  )
}

export default GenerateAnalysisButton
