import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@components/ui/toaster'

export const metadata: Metadata = {
  title: 'Personal Finance Visualiser',
  description: 'Personal Finance Visualiser',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Toaster/>
      <body>{children}</body>
    </html>
  )
}