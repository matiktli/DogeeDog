interface PromptConfig {
  challengeGeneration: (period: string, count: number) => string;
}

export const prompts: PromptConfig = {
  challengeGeneration: (period: string, count: number) => `Generate ${count} unique and creative dog challenges that think outside the box. Return ONLY a raw JSON array with no additional formatting, markdown, or explanation text. The response must be parseable by JSON.parse().

    The response must exactly match this format (but with ${count} items):
    [{"title":"Challenge Title","description":"Challenge description","icon":"🎯","reward":15}]

    Each challenge object must have these exact fields:
      title: string        // A short, engaging title (2-50 characters)
      description: string  // Clear description of what the dog owner needs to do (max 400 characters)
      icon: string        // EXACTLY ONE emoji character - no emoji combinations
      reward: number      // A number between 10 and 25

    Theme Categories (combine elements creatively):
    1. Modern Life & Technology
       - Dog-friendly video calls
       - Social media challenges
       - Smart home device interaction
       - Virtual dog meetups
    
    2. Cultural & Educational
       - Learning dog-related words in different languages
       - Historical dog breed reenactments
       - Famous dog movie scene recreations
       - Dog-inspired art projects
    
    3. Science & Discovery
       - Simple science experiments safe for dogs
       - Weather observation with your dog
       - Shadow and reflection games
       - Nature collection adventures
    
    4. Music & Performance
       - Doggy dance choreography
       - Musical instrument exposure
       - Sound recognition games
       - Rhythm training
    
    5. Environmental & Eco
       - Eco-friendly toy creation
       - Recycling games
       - Garden helper activities
       - Clean-up adventures
    
    6. Career & Role Play
       - Police dog training simulation
       - Therapy dog practice
       - Search and rescue games
       - Service dog skills
    
    7. Seasonal & Event-Based
       - Holiday-themed challenges
       - Sports season activities
       - Cultural festival participation
       - Weather-specific games

    Creative Guidelines:
    - Combine elements from different categories in unexpected ways
    - Create challenges that tell a story or have a theme
    - Include challenges that build up skills over time
    - Design activities that create memorable moments
    - Think about challenges that involve the whole family
    - Consider modern lifestyle trends
    - Include challenges that teach life skills in fun ways
    
    Innovation Requirements:
    1. Each challenge should feel fresh and unexpected
    2. Descriptions must paint a clear picture of success
    3. Icon MUST be exactly one emoji character (no combinations)
    4. Higher rewards (20-25) for more innovative challenges
    5. Include elements of storytelling or adventure
    6. Avoid common or standard dog training clichés
    7. Make each challenge Instagram-worthy
    8. Response MUST be valid JSON that can be parsed directly
    9. NO markdown formatting or explanation text
    10. STRICT: Each icon field must contain exactly one emoji

    Emoji Guidelines:
    - Use exactly ONE emoji per challenge
    - Choose emojis that best represent the core activity
    - NO emoji combinations or sequences
    - Invalid examples: "🎵🎨", "🐕‍🦺", "🌟✨"
    - Valid examples: "🎵", "🎨", "🐕"
    
    These challenges are for a ${period.toLowerCase()}ly period. Push creative boundaries while keeping activities safe and achievable!`
}; 