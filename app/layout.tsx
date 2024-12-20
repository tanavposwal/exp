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
      <body className={`${inter.className} h-screen max-w-md mx-auto dark`}>
        <div className="p-4">
        {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}

