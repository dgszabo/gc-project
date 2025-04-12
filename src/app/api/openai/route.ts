import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { topicsResponseSchema } from '@/lib/schemas';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that returns structured data in JSON format. The response must be an array of topics, where each topic has a 'topic' field and a 'description' field. The description must be at least 10 characters long."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    
    // Parse and validate the response using the topics schema
    const parsedResponse = JSON.parse(response || '{}');
    const validatedResponse = topicsResponseSchema.parse(parsedResponse);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Error calling ChatGPT:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 