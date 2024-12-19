import './globals.css'
import { anchorJack } from './config/fonts'
import AuthProvider from './providers/AuthProvider'
import Navbar from './components/Navbar'
import QueryProvider from './providers/QueryProvider'
import ExpiredTrialOverlay from './components/ExpiredTrialOverlay'
import { getServerSession } from 'next-auth'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get session
  const session = await getServerSession()
  
  // Get initial user data if session exists
  let userData = null
  if (session?.user?.id) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${session.user.id}`)
      if (response.ok) {
        userData = await response.json()
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  return (
    <html lang="en" className={`${anchorJack.variable}`}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">
              <ExpiredTrialOverlay user={userData} />
              {children}
            </main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
