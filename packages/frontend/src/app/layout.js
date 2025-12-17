import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Affiliateme - Affiliate Marketing Management',
  description: 'Track and manage your affiliate links, earnings, and analytics',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
