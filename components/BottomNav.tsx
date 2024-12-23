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
    <div className="fixed max-w-md mx-auto bottom-3 left-3 right-3">
      <div className="">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="py-6 text-lg bg-gradient-to-br from-neutral-300 to-neutral-400 text-black shadow mt-4 w-full">
              <PlusCircle className="mr-1 h-8 w-8" />
              Add Transaction
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] max-w-md mx-auto rounded-t-2xl overflow-y-auto scrollbar-none">
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="expense" className="text-sm py-2">Expense</TabsTrigger>
                <TabsTrigger value="income" className="text-sm py-2">Income</TabsTrigger>
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

