interface PromptConfig {
  challengeGeneration: (period: string, count: number) => string;
}

export const prompts: PromptConfig = {
  challengeGeneration: (period: string, count: number) => `Generate ${count} unique and creative dog challenges. Return ONLY a raw JSON array with no additional formatting, markdown, or explanation text. The response must be parseable by JSON.parse().

    The response must exactly match this format (but with ${count} items):
    [{"title":"Challenge Title","description":"Challenge description","icon":"🎯","reward":15}]

    Each challenge object must have these exact fields:
      title: string        // A short, engaging title (2-50 characters)
      description: string  // Clear description of what the dog owner needs to do (max 400 characters)
      icon: string        // A single emoji that represents the challenge
      reward: number      // A number between 10 and 25

    Include a variety of:
    - Training activities (basic commands, tricks)
    - Physical activities (walks, play sessions)
    - Social activities (dog park visits, meeting friends)
    - Mental stimulation (puzzle toys, hide and seek)
    - Bonding activities (grooming, massage)
    - Fun and silly activities (dog fashion show, dance with your dog)

    Requirements:
    1. Each title should be unique, fun, and engaging
    2. Descriptions should be clear, actionable, and sometimes humorous
    3. Icons should be relevant single emojis
    4. Reward points should be numbers between 10 and 25
    5. Mix both practical and entertaining challenges
    6. Avoid repetitive or overly similar challenges
    7. Make sure the challenges are achievable and fun for the dog and owner
    8. Response MUST be valid JSON that can be parsed directly
    9. NO markdown formatting, explanation text, or code blocks
    
    These challenges are for a ${period.toLowerCase()}ly period. Make them varied and exciting!`
}; 