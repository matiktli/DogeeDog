import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { DailyTip } from '@/app/models/DailyTip'
import dbConnect from '@/app/lib/mongodb'
import OpenAI from 'openai'
import { prompts } from '@/app/resources/config/prompts'

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Connect to database first
    await dbConnect()

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { count = 1 } = await request.json()

    // Generate tip using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable dog behavior expert and trainer who provides valuable, science-based tips for dog owners. Focus on practical, actionable advice that helps improve the relationship between dogs and their owners while ensuring the well-being of the pet.",
        },
        {
          role: "user",
          content: prompts.tipGeneration(count),
        },
      ],
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      top_p: 0.95,
    })

    const response = completion.choices[0].message?.content
    let generatedTips = []

    try {
      // Clean the response and parse JSON
      const cleanedResponse = response?.replace(/```json\n?|```\n?/g, '') || '[]'
      generatedTips = JSON.parse(cleanedResponse)

      if (!Array.isArray(generatedTips)) {
        generatedTips = [generatedTips]
      }

      // Save the generated tip to database
      const savedTip = await DailyTip.create({
        ...generatedTips[0],
        createdAt: new Date()
      })

      return NextResponse.json(savedTip)
    } catch (error) {
      console.error('Error processing response:', error, 'Response:', response)
      return NextResponse.json(
        { error: 'Failed to process or save tip' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error generating tip:', error)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 