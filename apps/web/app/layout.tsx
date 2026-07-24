import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'கல்வி.AI — Teacher Dashboard',
  description: 'AI Literacy Platform for Government Schools',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
