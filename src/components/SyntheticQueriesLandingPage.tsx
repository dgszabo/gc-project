'use client';

import { useState } from 'react';
import {
  generateTopics,
  generateThreads,
  analyzeChatThreads
} from '@/app/actions/anthropic';

import Slider from '@/components/slider';
import ChatThreadModal from '@/components/chatThreadModal';
import { Analysis, Thread, Message } from '@/lib/schemas';
import AnalysisResultModal from '@/components/analysisResultModal';
import GenerateTopicsButton from '@/components/generateTopicsButton';
import GenerateThreadsButton from '@/components/generateThreadsButton';
import GenerateAnalysisButton from '@/components/generateAnalysisButton';

export default function SyntheticQueriesLandingPage() {
  const [areaOfLaw, setAreaOfLaw] = useState('privacy law');
  const [topics, setTopics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [threads, setThreads] = useState<Message[][] | null>(null);
  const [isGeneratingThreads, setIsGeneratingThreads] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const handleGenerateThreads = async () => {
    try {
      setIsGeneratingThreads(true);
      setError(null);
      setThreads(null);
      setAnalysis(null);
      
      const data = await generateThreads(topics);
      
      console.log('Received threads:', data); // Debug log
      
      if (!data.threads) {
        throw new Error('Invalid response format: threads missing');
      }

      setThreads(data.threads.map((thread: Thread) => thread.messages));
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGeneratingThreads(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    try {
      setIsGeneratingAnalysis(true);
      setError(null);
      setAnalysis(null);
      
      const data = await analyzeChatThreads(threads as Message[][], areaOfLaw);
      
      console.log('Received analysis:', data); // Debug log
      
      if (!data) {
        throw new Error('Invalid response format: analysis missing');
      }

      setAnalysis(data as Analysis);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Synthetic GC Data Generator and Analytics</h1>
        <p className="text-lg mb-8">Generate synthetic data about in house GC and AI legal assistant interactions and analyze it with AI</p>
        
        <div className="mb-4">
          <Slider
            option1="Privacy Law"
            option2="Commercial Contracts Law"
            onToggle={(isOption2: boolean) => setAreaOfLaw(isOption2 ? 'commercial contracts law' : 'privacy law')}
          />
        </div>

        <div className="flex gap-4">
          <GenerateTopicsButton
            areaOfLaw={areaOfLaw}
            setTopics={setTopics}
            setThreads={setThreads}
            setAnalysis={setAnalysis}
            setError={setError}
            setLoading={setIsGeneratingTopics}
          />

          <GenerateThreadsButton
            topics={topics}
            setThreads={setThreads}
            setAnalysis={setAnalysis}
            setError={setError}
            setLoading={setIsGeneratingThreads}
          />

          <GenerateAnalysisButton
            threads={threads}
            areaOfLaw={areaOfLaw}
            setAnalysis={setAnalysis}
            setError={setError}
            setLoading={setIsGeneratingAnalysis}
          />

          {analysis && (
            <AnalysisResultModal analysis={analysis} />
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {topics && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Generated Topics</h2>
            <div className="space-y-4">
              {topics.map((topic: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-gray-600">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-medium">{topic.title}</h3>
                      <p className="mt-2">{topic.description}</p>
                    </div>
                    <ChatThreadModal 
                      title={topic.title}
                      messages={threads?.[index] || []}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
