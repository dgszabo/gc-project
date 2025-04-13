'use server';

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic'
import { Topic, topicsResponseSchema, threadSchema } from '@/lib/schemas';

export async function generateTopics(areaOfLaw: string = 'privacy law') {
  const { object: topics } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    maxTokens: 2000,
    schema: topicsResponseSchema,
    prompt: `
      You are a world class legal expert. You generate life-like topics an in house legal council of a company would have a conversations about with their AI legal assistant.

      Generate 10 topics the in house legal council would discuss with the AI assistant about ${areaOfLaw} law relevant to the company. Be brief, but make sure the topic ideas are sufficiently detailed.
    `
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
        model: anthropic('claude-3-5-sonnet-20241022'),
        maxTokens: 4000,
        schema: threadSchema,
        prompt: `
          You are a world class legal expert. You are simulating a life-like conversation between an in house legal council and their AI legal assistant about ${topic.title}. In more detail, the topic is ${topic.description}.
          
          Generate a detailed conversation thread between the legal council and AI assistant discussing this topic. Include specific questions, concerns and advice. Ground the conversation in law and the company's specific situation, and include legal basis analysis where appropriate.
        `
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

