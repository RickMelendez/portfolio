import type { Metadata } from 'next'
import { Orbitron, Inter, Barlow_Condensed, Barlow, Fira_Code } from 'next/font/google'
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

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-barlow',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-fira-code',
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
    <html lang="en" className={`${orbitron.variable} ${inter.variable} ${barlowCondensed.variable} ${barlow.variable} ${firaCode.variable}`}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  )
}
