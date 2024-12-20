'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFilteredTransactions, Transaction } from '@/utils/dataManager'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { format } from 'date-fns'

const allTags = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Housing', emoji: '🏠' },
  { name: 'Entertainment', emoji: '🎉' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Health', emoji: '🏥' },
  { name: 'Education', emoji: '📚' },
  { name: 'Other', emoji: '💼' },
]

export default function FilterTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setFilteredTransactions(getFilteredTransactions(selectedTags))
  }, [selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="space-y-6">
      <Card className="apple-card mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Filter by Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Select Tags
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {allTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.name}
                  checked={selectedTags.includes(tag.name)}
                  onCheckedChange={() => toggleTag(tag.name)}
                >
                  <div className="flex items-center">
                    <img 
                      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${tag.emoji.codePointAt(0)?.toString(16)}.png`} 
                      alt={tag.name} 
                      className="w-6 h-6 mr-2"
                    />
                    {tag.name}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Filtered Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground">No transactions found</p>
          ) : (
            <ul className="space-y-4">
              {filteredTransactions.map(transaction => (
                <li key={transaction.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.title}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                  </div>
                  <span className={`font-semibold ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

