'use client';

import { useState } from 'react';
import { TopicsResponse } from '@/lib/schemas';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [chatResponse, setChatResponse] = useState<TopicsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callBackend = async () => {
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'test' })
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      setResponse('Error calling backend');
    }
  };

  const callChatGPT = async () => {
    try {
      setError(null);
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "List 3 important topics an inhouse legal council would sicuss with their AI legal assistant and explain them in detail about privacy law relavant for the company."
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await res.json();
      console.log('Received data:', data); // Debug log
      
      if (!data.topics) {
        throw new Error('Invalid response format: topics missing');
      }

      setChatResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setChatResponse(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Hello World!</h1>
      <div className="flex gap-4">
        <button 
          onClick={callBackend}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Call Backend
        </button>
        <button 
          onClick={callChatGPT}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Call ChatGPT
        </button>
      </div>
      {response && (
        <p className="text-lg mt-4">Backend says: {response}</p>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      {chatResponse?.topics && (
        <div className="mt-4 p-4 bg-gray-100 text-black rounded max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-2">Topics</h2>
          <div className="space-y-4">
            {chatResponse.topics.map((topic, index) => (
              <div key={index} className="p-4 bg-white rounded shadow">
                <h3 className="text-lg font-semibold">{topic.topic}</h3>
                <p className="mb-2">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
