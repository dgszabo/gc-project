import { z } from 'zod';

// TOPICS SCHEMAs
export const topicSchema = z.object({
  title: z.string().min(1, "Title of the topic cannot be empty"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  role: z.enum(['user', 'assistant'], {
    errorMap: () => ({ message: "Role must be either 'user' or 'assistant'" })
  })
});

export const topicsResponseSchema = z.object({
  topics: z.array(topicSchema).min(1, "Must have at least one topic"),
});

export type Topic = z.infer<typeof topicSchema>;
export type TopicsResponse = z.infer<typeof topicsResponseSchema>;

// THREADS SCHEMAs
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant'], {
    errorMap: () => ({ message: "Role must be either 'user' or 'assistant'" })
  }),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export const threadSchema = z.object({
  messages: z.array(messageSchema).min(2, "Must have at least two messages"),
});

export const threadsResponseSchema = z.object({
  threads: z.array(threadSchema).min(1, "Must have at least one thread"),
});

export type Message = z.infer<typeof messageSchema>;
export type Thread = z.infer<typeof threadSchema>;
export type ThreadsResponse = z.infer<typeof threadsResponseSchema>;

