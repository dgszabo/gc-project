'use server';

import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic'
import { topicsResponseSchema } from '@/lib/schemas';

export async function generateTopics(areaOfLaw: string = 'privacy law') {
  const { object } = await generateObject({
    model: anthropic('claude-3-5-sonnet-20241022'),
    maxTokens: 2000,
    schema: topicsResponseSchema,
    prompt: `
      You are a world class legal expert. You generate life-like topics an in house legal council of a company would have a conversations about with their AI legal assistant.

      Generate 10 topics the in house legal council would discuss with the AI assistant about ${areaOfLaw} law relevant to the company. Be brief, but make sure the topic ideas are sufficiently detailed.
    `
  });

  return object;
}