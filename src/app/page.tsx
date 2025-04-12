'use client';

import { useState } from 'react';
import { generateTopics } from '@/app/actions/anthropic';

export default function Home() {
  const [chatResponse, setChatResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await generateTopics(
        "List 3 important topics an inhouse legal council would discuss with their AI legal assistant and explain them in detail about privacy law relevant for the company."
      );
      
      console.log('Received data:', data); // Debug log
      
      if (!data.topics) {
        throw new Error('Invalid response format: topics missing');
      }

      setChatResponse(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Legal Topics Generator</h1>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Topics'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {chatResponse && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Generated Topics</h2>
            <div className="space-y-4">
              {chatResponse.topics.map((topic: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-gray-600">
                  <h3 className="text-xl font-medium">{topic.title}</h3>
                  <p className="mt-2">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
