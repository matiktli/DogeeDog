import './globals.css'
import { anchorJack } from './config/fonts'
import AuthProvider from './providers/AuthProvider'
import Navbar from './components/Navbar'
import QueryProvider from './providers/QueryProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${anchorJack.variable}`}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
