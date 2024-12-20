'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, Pencil, Trash2 } from 'lucide-react'
import { getTransactions, Transaction, deleteTransaction } from '@/utils/dataManager'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import EditTransactionForm from '@/components/EditTransactionForm'
import { format } from 'date-fns'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    setTransactions(getTransactions())
  }, [])

  const thisMonthExpense = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  const thisMonthEarning = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  const handleDelete = (id: string) => {
    deleteTransaction(id)
    setTransactions(getTransactions())
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleEditComplete = () => {
    setEditingTransaction(null)
    setTransactions(getTransactions())
  }

  return (
    <div className="space-y-6 min-h-screen overflow-x-auto">
      <div className="flex items-center justify-center gap-4 h-72">
        <Card className="apple-card flex-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Expenses</h2>
            <p className="text-3xl font-bold text-red-500">${thisMonthExpense.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="apple-card flex-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Income</h2>
            <p className="text-3xl font-bold text-green-500">${thisMonthEarning.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Button asChild variant="ghost">
        <Link href="/filter-tags">
          <Filter className="mr-2 h-4 w-4" /> Filter Transactions
        </Link>
      </Button>
      <Card className="apple-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <ul className="space-y-4">
            {transactions.slice(0, 10).map(transaction => (
              <li key={transaction.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      {editingTransaction && (
                        <EditTransactionForm
                          transaction={editingTransaction}
                          onComplete={handleEditComplete}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

