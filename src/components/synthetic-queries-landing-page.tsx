'use client';

import { useState } from 'react';

import Slider from '@/components/slider';
import ChatThreadModal from '@/components/chat-thread-modal';
import { Analysis, Thread, Message } from '@/lib/schemas';
import AnalysisResultModal from '@/components/analysis-result-modal';
import GenerateTopicsButton from '@/components/generate-topics-button';
import GenerateThreadsButton from '@/components/generate-threads-button';
import GenerateAnalysisButton from '@/components/generate-analysis-button';

// Area of law options
const AREA_OF_LAW_OPTION_PRIVACY = 'Privacy Law';
const AREA_OF_LAW_OPTION_COMMERCIAL_CONTRACTS = 'Commercial Contracts Law';

// Model options
const MODEL_OPTION_ANTHROPIC = 'Anthropic';
const MODEL_OPTION_OPENAI = 'OpenAI';

export default function SyntheticQueriesLandingPage() {
  const [areaOfLaw, setAreaOfLaw] = useState(AREA_OF_LAW_OPTION_PRIVACY);
  const [model, setModel] = useState(MODEL_OPTION_ANTHROPIC);
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
        
        {/* Area of law and model sliders - changing the area of law resets the flow, but you can mix and match models during different steps of the flow */}
        <div className="flex justify-between mb-6 w-full">
          <Slider
            option1={AREA_OF_LAW_OPTION_PRIVACY}
            option2={AREA_OF_LAW_OPTION_COMMERCIAL_CONTRACTS}
            onToggle={(isOption2: boolean) => {
              setAreaOfLaw(isOption2 ? AREA_OF_LAW_OPTION_COMMERCIAL_CONTRACTS : AREA_OF_LAW_OPTION_PRIVACY);
              setTopics(null);
              setThreads(null);
              setAnalysis(null);
              setError(null);
              setIsLoading(false);
            }}
            isLoading={isLoading}
          />

          <Slider
            option1={MODEL_OPTION_ANTHROPIC}
            option2={MODEL_OPTION_OPENAI}
            onToggle={(isOption2: boolean) => setModel(isOption2 ? MODEL_OPTION_OPENAI.toLowerCase() : MODEL_OPTION_ANTHROPIC.toLowerCase())}
            isLoading={isLoading}
          />
        </div>

        {/* Generate topics, threads, and analysis buttons - clicking these buttons will trigger the generation of the respective data; data can only be generated if the prerequisit data has been generated */}
        <div className="flex gap-4">
          <GenerateTopicsButton
            areaOfLaw={areaOfLaw}
            setTopics={setTopics}
            setThreads={setThreads}
            setAnalysis={setAnalysis}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            model={model}
          />

          <GenerateThreadsButton
            topics={topics}
            setThreads={setThreads}
            setAnalysis={setAnalysis}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            model={model}
          />

          <GenerateAnalysisButton
            threads={threads}
            areaOfLaw={areaOfLaw}
            setAnalysis={setAnalysis}
            setError={setError}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            model={model}
          />

          {analysis && (
            <AnalysisResultModal analysis={analysis} />
          )}
        </div>

        {/* Error message - displayed if an error occurs */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Generated topics - displayed if topics have been generated, including chat threads generated for the topics if they exist */}
        {topics && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Generated Topics</h2>
            <div className="space-y-4">
              {topics.map((topic: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-gray-600">
                  <div className="flex justify-between pr-4">
                    <div className="mr-4">
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
