import '@/app/globals.css'
import { Inter } from 'next/font/google'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses and earnings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        <div className="max-w-md mx-auto p-4 pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}

