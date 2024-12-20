export interface DogChallenge {
  _id: string
  name: string
  dogId: string
  challengeId: string
  progress: {
    current: number
    goal: number
  }
  completedDate: Date | null
  createdBy: string
  createdAt: Date
}