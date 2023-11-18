'use client'
import './globals.css'
import { Inter } from 'next/font/google'

import header from '../components/header'
import footer from '../components/footer'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>{header()}</header>
        {children}
        <footer>{footer()}</footer>
        </body>
    </html>
  )
}
