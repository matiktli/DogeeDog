import dbConnect from '@/app/lib/mongodb'
import { Challenge } from '@/app/models/Challenge'

const systemChallenges = [
  {
    name: 'Daily Walk',
    description: 'Take your dog for a 30-minute walk',
    icon: '🦮',
    reward: 10,
    type: 'SYSTEM',
    period: 'DAY',
    createdBy: 'SYSTEM'
  },
  {
    name: 'Weekly Training',
    description: 'Complete 3 training sessions with your dog',
    icon: '🎯',
    reward: 50,
    type: 'SYSTEM',
    period: 'WEEK',
    createdBy: 'SYSTEM'
  },
  // Add more system challenges as needed
]

async function seedChallenges() {
  try {
    await dbConnect()
    
    // Clear existing system challenges
    await Challenge.deleteMany({ type: 'SYSTEM' })
    
    // Insert new system challenges
    await Challenge.insertMany(systemChallenges)
    
    console.log('Successfully seeded system challenges')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding challenges:', error)
    process.exit(1)
  }
}

seedChallenges() 