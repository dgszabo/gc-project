'use client'

import { useState } from 'react'

import { generateTopics as generateTopicsAnthropic } from '@/app/actions/anthropic'
import { generateTopics as generateTopicsOpenAI } from '@/app/actions/openai'
import { Spinner } from '@/components/spinner';

interface Topic {
  title: string;
  description: string;
  role: "user" | "assistant";
}

interface GenerateTopicsButtonProps {
  areaOfLaw: string;
  setTopics: (topics: any) => void;
  setThreads: (threads: any) => void;
  setAnalysis: (analysis: any) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  model: string;
}

const GenerateTopicsButton = ({
  areaOfLaw,
  setTopics,
  setError,
  isLoading,
  setIsLoading,
  setThreads,
  setAnalysis,
  model,
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
      
      const data = model === 'anthropic' ? await generateTopicsAnthropic(areaOfLaw) : await generateTopicsOpenAI(areaOfLaw)
      
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
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 cursor-pointer'} flex items-center justify-center`}
    >
      {isGenerating ? (
        <>
          <Spinner className="mr-2" />
          <span>Generating Topics...</span>
        </>
      ) : (
        'Generate Topics'
      )}
    </button>
  )
}
export default GenerateTopicsButton

