export interface Challenge {
  _id: string
  title: string
  description: string
  icon: string
  reward: number
  type: 'SYSTEM' | 'USER'
  period: 'DAY' | 'WEEK'
  createdBy: string
  createdAt: Date
}

export type ChallengeInput = Omit<Challenge, '_id' | 'createdAt'> 