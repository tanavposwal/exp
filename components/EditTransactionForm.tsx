import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Transaction, editTransaction } from '@/utils/dataManager'

const categories = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Housing', emoji: '🏠' },
  { name: 'Entertainment', emoji: '🎉' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Health', emoji: '🏥' },
  { name: 'Education', emoji: '📚' },
  { name: 'Other', emoji: '💼' },
]

interface EditTransactionFormProps {
  transaction: Transaction;
  onComplete: () => void;
}

export default function EditTransactionForm({ transaction, onComplete }: EditTransactionFormProps) {
  const [title, setTitle] = useState(transaction.title)
  const [amount, setAmount] = useState(transaction.amount.toString())
  const [selectedCategory, setSelectedCategory] = useState(transaction.category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    editTransaction({
      ...transaction,
      title,
      amount: parseFloat(amount),
      category: selectedCategory,
    })
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-lg font-medium">Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="mt-1 text-lg py-3"
        />
      </div>
      <div>
        <Label htmlFor="amount" className="text-lg font-medium">Amount</Label>
        <Input 
          id="amount" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
          className="mt-1 text-lg py-3"
        />
      </div>
      <div>
        <Label className="text-lg font-medium">Category</Label>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              type="button"
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
              className="flex flex-col items-center p-3 h-auto apple-button"
            >
              <img 
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${category.emoji.codePointAt(0)?.toString(16)}.png`} 
                alt={category.name} 
                className="w-10 h-10 mb-2"
              />
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg apple-button">
        Save Changes
      </Button>
    </form>
  )
}

