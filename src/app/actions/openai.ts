'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic'

export async function generateTopics(prompt: string) {
  const { object } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    maxTokens: 1000,
    schema: z.object({
      topics: z.array(
        z.object({
          title: z.string().describe('Title of the topic'),
          description: z.string().min(10).describe('Detailed description of the topic')
        })
      ).min(1)
    }),
    prompt
  });

  // Return only the serializable data
  return {
    topics: object.topics.map(topic => ({
      title: topic.title,
      description: topic.description
    }))
  };
}