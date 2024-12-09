import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth'

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

    const prompt = `Generate ${count} unique and fun dog challenges. Return the result as a JSON array where each challenge object has these exact fields matching the following TypeScript interface:

    interface Challenge {
      title: string;        // A short, engaging title (2-50 characters)
      description: string;  // Clear description of what the dog owner needs to do (max 400 characters)
      icon: string;        // A single emoji that represents the challenge
      reward: number;      // A number between 10 and 25
    }

    Example response format:
    [
      {
        "title": "Morning Walk Challenge",
        "description": "Take your dog for a 15-minute walk before breakfast",
        "icon": "🌅",
        "reward": 15
      }
    ]

    Make sure:
    1. Each title is unique and engaging
    2. Descriptions are clear and actionable
    3. Icons are relevant single emojis
    4. Reward points are numbers between 10 and 25
    
    These challenges are for a ${period.toLowerCase()}ly period.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message?.content;
    let challenges = [];
    
    try {
      challenges = JSON.parse(response || '[]');
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