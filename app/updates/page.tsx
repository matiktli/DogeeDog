import UpdateEntry from '../components/UpdateEntry'

export default function Updates() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-12">DogeeDog Updates</h1>
        
        <UpdateEntry
          title="🤝 Community"
          date="December 15th, 2023"
          description={
            <>
              <p>Connect with other dog parents! Our new community feature lets you:</p>
              <p>• Share training tips and success stories</p>
              <p>• Join local dog walking groups</p>
              <p>• Participate in weekly training challenges with other members</p>
              <p>• Ask questions and get advice from certified dog trainers</p>
            </>
          }
        />

        <UpdateEntry
          title="🎯 Missions"
          date="December 1st, 2023"
          description={
            <>
              <p>Introducing Daily Training Missions! 🎉</p>
              <p>• Get personalized training tasks based on your dog&apos;s progress</p>
              <p>• Earn badges and rewards for completing missions</p>
              <p>• Track your streak and level up your training skills</p>
              <p>• New missions unlock as you and your pup progress</p>
            </>
          }
        />

        <UpdateEntry
          title="🏆 Challenges"
          date="November 15th, 2023"
          description={
            <>
              <p>Weekly Training Challenges are here! Each challenge focuses on essential skills:</p>
              <p>• Basic obedience challenges (Sit, Stay, Come)</p>
              <p>• Leash training progression</p>
              <p>• Socialization exercises</p>
              <p>Complete challenges to unlock special achievements and training tips! 🌟</p>
            </>
          }
        />

        <UpdateEntry
          title="🐕 Dog Profiles"
          date="November 1st, 2023"
          description={
            <>
              <p>Create your dog&apos;s profile and start your training journey! Features include:</p>
              <p>• Customizable profile with photos and basic info</p>
              <p>• Track age, breed, and training milestones</p>
              <p>• Record medical history and important dates</p>
              <p>• Set training goals specific to your pup&apos;s needs</p>
              <p>Multiple dog profiles available for families with more than one furry friend! 🐾</p>
            </>
          }
        />
      </div>
    </main>
  )
} 