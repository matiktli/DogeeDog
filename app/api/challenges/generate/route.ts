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

    const { period, count = 1, type = 'SYSTEM' } = await request.json();

    // Validate period
    if (!['DAY', 'WEEK'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be DAY or WEEK' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['SYSTEM', 'USER'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be SYSTEM or USER' },
        { status: 400 }
      );
    }

    const prompt = prompts.challengeGeneration(period, count);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative dog trainer who loves to make engaging and sometimes silly challenges for dog owners. Mix practical training with fun activities. Respond with raw JSON only, no markdown formatting or explanation text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    });

    const response = completion.choices[0].message?.content;
    let challenges = [];
    
    try {
      // Clean the response by removing any markdown formatting
      const cleanedResponse = response?.replace(/```json\n?|```\n?/g, '') || '[]';
      challenges = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(challenges)) {
        challenges = [challenges];
      }

      // Add period and type to each challenge
      challenges = challenges.map(challenge => ({
        ...challenge,
        period,
        type
      }));

    } catch (error) {
      console.error('Parse error:', error, 'Response:', response);
      return NextResponse.json(
        { error: 'Failed to parse ChatGPT response: ' + error },
        { status: 500 }
      );
    }

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error generating challenges:', error);
    return NextResponse.json(
      { error: 'Failed to generate challenges' },
      { status: 500 }
    );
  }
} 