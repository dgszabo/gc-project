'use server';

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai'

import { Topic, topicsResponseSchema, threadSchema, Message, analysisSchema } from '@/lib/schemas';
import { buildAnalysisPrompt, buildThreadPrompt, buildTopicsPrompt } from '@/lib/helpers';

export async function generateTopics(areaOfLaw: string = 'privacy law') {
  const { object: topics } = await generateObject({
    model: openai('gpt-4o'),
    maxTokens: 2000,
    schema: topicsResponseSchema,
    prompt: buildTopicsPrompt(areaOfLaw)
  });

  return topics;
}

export async function generateThreads(topics: Topic[]) {
  const threadPromises = topics.map(topic =>  generateThreadWithRetry(topic));

  const threadResults = await Promise.all(threadPromises);
  
  return {
    threads: threadResults.map(result => result.object)
  };
}

async function generateThreadWithRetry(topic: Topic, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await generateObject({
        model: openai('gpt-4o'),
        maxTokens: 8000,
        schema: threadSchema,
        prompt: buildThreadPrompt(topic)
      });
      return result;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.error(`Attempt ${i + 1} failed, retrying...`, error);
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function analyzeChatThreads(threads: Message[][], areaOfLaw: string) {
  const { object: analysis } = await generateObject({
    model: openai('gpt-4o'),
    maxTokens: 8000,
    schema: analysisSchema,
    prompt: buildAnalysisPrompt(threads, areaOfLaw)
  });

  if (!analysis) {
    throw new Error('Failed to generate analysis');
  }

  return analysis;
}
