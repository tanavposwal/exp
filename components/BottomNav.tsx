'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AddTransactionForm from './AddTransactionForm'

export default function BottomNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false)
    router.refresh()
  }

  return (
    <div className="fixed max-w-md mx-auto bottom-6 left-0 right-0">
      <div className="px-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="py-6 text-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:to-blue-600 hover:from-blue-600 text-white shadow">
              <PlusCircle className="mr-2 h-6 w-6" />
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl overflow-y-auto scrollbar-none">
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="expense" className="text-sm py-1">Expense</TabsTrigger>
                <TabsTrigger value="income" className="text-sm py-1">Income</TabsTrigger>
              </TabsList>
              <TabsContent value="expense">
                <AddTransactionForm type="expense" onClose={handleClose} />
              </TabsContent>
              <TabsContent value="income">
                <AddTransactionForm type="income" onClose={handleClose} />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

