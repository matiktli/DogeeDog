import { NextResponse } from 'next/server'
import { Challenge } from '@/app/models/Challenge'
import dbConnect from '@/app/lib/mongodb'
import OpenAI from 'openai'
import { prompts } from '@/app/resources/config/prompts'

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: Request) {
  try {
    // Verify the cron secret to ensure the request is from Vercel
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Generate challenges using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an innovative dog activity designer who creates unique, unexpected, and engaging challenges. Think outside the conventional dog training box and combine elements from different areas of life to create fresh experiences. Focus on novelty and creativity while maintaining safety and achievability.",
        },
        {
          role: "user",
          content: prompts.challengeGeneration('WEEK', Number(process.env.WEEKLY_CHALLENGES_TO_GENERATE)),
        },
      ],
      temperature: 1.0,
      presence_penalty: 0.8,
      frequency_penalty: 0.8,
      top_p: 0.95,
    })

    const response = completion.choices[0].message?.content
    let challenges = []

    try {
      // Clean the response by removing any markdown formatting
      const cleanedResponse = response?.replace(/```json\n?|```\n?/g, '') || '[]'
      challenges = JSON.parse(cleanedResponse)

      if (!Array.isArray(challenges)) {
        challenges = [challenges]
      }

      // Add period and type to each challenge
      challenges = challenges.map(challenge => ({
        ...challenge,
        period: 'WEEK',
        type: 'SYSTEM',
        createdAt: new Date()
      }))

      // Save challenges to database
      for (const challenge of challenges) {
        await Challenge.create(challenge)
      }

    } catch (error) {
      console.error('Parse error:', error, 'Response:', response)
      return NextResponse.json(
        { error: 'Failed to parse ChatGPT response: ' + error },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Weekly challenges generated successfully',
      challenges: challenges
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
} 