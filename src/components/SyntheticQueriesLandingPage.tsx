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
  const [threads, setThreads] = useState<Message[][] | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <GenerateThreadsButton
            topics={topics}
            setThreads={setThreads}
            setAnalysis={setAnalysis}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />

          <GenerateAnalysisButton
            threads={threads}
            areaOfLaw={areaOfLaw}
            setAnalysis={setAnalysis}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
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
                  <div className="flex justify-between pr-4">
                    <div>
                      <h3 className="text-xl font-medium">{topic.title}</h3>
                      <p className="mt-2">{topic.description}</p>
                    </div>
                    <ChatThreadModal 
                      title={topic.title}
                      messages={threads?.[index] || []}
                      isLoading={isLoading}
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
