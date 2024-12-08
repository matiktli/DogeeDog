import './globals.css'
import { anchorJack } from './config/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${anchorJack.variable}`}>
      <body>{children}</body>
    </html>
  )
}
