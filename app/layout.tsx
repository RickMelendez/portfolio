import type { Metadata } from 'next'
import { Orbitron, Inter, VT323, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-share-tech-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ricardo Sánchez Meléndez | Full Stack Developer',
  description: 'Full Stack Developer & Cloud Engineer specializing in serverless architectures, AWS Lambda, TypeScript, and AI-powered applications.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${vt323.variable} ${shareTechMono.variable}`}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
