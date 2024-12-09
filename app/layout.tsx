import './globals.css'
import { anchorJack } from './config/fonts'
import AuthProvider from './providers/AuthProvider'
import Navbar from './components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${anchorJack.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
