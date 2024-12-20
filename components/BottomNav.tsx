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
    <div className="fixed bottom-6 left-0 right-0">
      <div className="max-w-md mx-auto px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg apple-button">
              <PlusCircle className="mr-2 h-6 w-6" />
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="expense" className="text-lg py-3">Expense</TabsTrigger>
                <TabsTrigger value="income" className="text-lg py-3">Income</TabsTrigger>
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

