import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth'
import { prompts } from '@/app/resources/config/prompts';

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { count = 1 } = await request.json();

    const prompt = prompts.tipGeneration(count);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable dog behavior expert and trainer who provides valuable, science-based tips for dog owners. Focus on practical, actionable advice that helps improve the relationship between dogs and their owners while ensuring the well-being of the pet.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      top_p: 0.95,
    });

    const response = completion.choices[0].message?.content;
    let tips = [];
    
    try {
      // Clean the response by removing any markdown formatting
      const cleanedResponse = response?.replace(/```json\n?|```\n?/g, '') || '[]';
      tips = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(tips)) {
        tips = [tips];
      }

    } catch (error) {
      console.error('Parse error:', error, 'Response:', response);
      return NextResponse.json(
        { error: 'Failed to parse ChatGPT response: ' + error },
        { status: 500 }
      );
    }

    return NextResponse.json(tips);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 