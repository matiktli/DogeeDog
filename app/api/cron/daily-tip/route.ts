import { NextResponse } from 'next/server'
import { DailyTip } from '@/app/models/DailyTip'
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
          content: prompts.tipGeneration(3),
        },
      ],
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      top_p: 0.95,
    })

    const response = completion.choices[0].message?.content
    let generatedTips = []

    // Clean the response and parse JSON
    const cleanedResponse = response?.replace(/```json\n?|```\n?/g, '') || '[]'
    generatedTips = JSON.parse(cleanedResponse)

    if (!Array.isArray(generatedTips)) {
      generatedTips = [generatedTips]
    }

    //for each generated tip save it
    for (const tip of generatedTips) {
      await DailyTip.create({
        ...tip,
        createdAt: new Date()
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Daily tip generated successfully',
      tips: generatedTips 
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
} 