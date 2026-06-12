import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ExamGuard — Live Monitoring',
  description: 'Real-time exam proctoring dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
