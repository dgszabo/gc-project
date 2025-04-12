'use server';

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic'
import { topicsResponseSchema } from '@/lib/schemas';

export async function generateTopics(prompt: string) {
  const { object } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    maxTokens: 1000,
    schema: topicsResponseSchema,
    prompt
  });

  return object;
}