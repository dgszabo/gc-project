import { z } from 'zod';

// Define the schema for a single topic
export const topicSchema = z.object({
  topic: z.string().min(1, "Topic cannot be empty"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Define the schema for the entire response
export const topicsResponseSchema = z.object({
  topics: z.array(topicSchema).min(1, "Must have at least one topic"),
});

// Type inference
export type Topic = z.infer<typeof topicSchema>;
export type TopicsResponse = z.infer<typeof topicsResponseSchema>;
