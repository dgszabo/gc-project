'use client'

import { useState } from 'react'

import { analyzeChatThreads as analyzeChatThreadsAnthropic } from '@/app/actions/anthropic'
import { analyzeChatThreads as analyzeChatThreadsOpenAI } from '@/app/actions/openai'
import { Message, Analysis } from '@/lib/schemas'
import { Spinner } from '@/components/spinner';

interface GenerateAnalysisButtonProps {
  threads: Message[][] | null;
  areaOfLaw: string;
  setAnalysis: (analysis: Analysis | null) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  model: string;
}

const GenerateAnalysisButton = ({
  threads,
  areaOfLaw,
  setAnalysis,
  setError,
  isLoading,
  setIsLoading,
  model,
}: GenerateAnalysisButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAnalysis = async () => {
    if (isGenerating || !threads) return
    
    try {
      setIsGenerating(true)
      setIsLoading(true)
      setError(null)
      setAnalysis(null)
      
      const data = model === 'anthropic' ? await analyzeChatThreadsAnthropic(threads as Message[][], areaOfLaw) : await analyzeChatThreadsOpenAI(threads as Message[][], areaOfLaw)
      
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
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${!threads || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'} flex items-center justify-center`}
    >
      {isGenerating ? (
        <>
          <Spinner className="mr-2" />
          <span>Generating Analysis...</span>
        </>
      ) : (
        'Generate Analysis'
      )}
    </button>
  )
}

export default GenerateAnalysisButton
