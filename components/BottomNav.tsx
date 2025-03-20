"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PlusCircle, PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddTransactionForm from "./AddTransactionForm";

export default function BottomNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="">
      <div className="">
        <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <SheetTrigger asChild>
            <button className="px-3 py-1 rounded-full from-black/60 to-black bg-gradient-to-br shadow">
              <PlusIcon className="h-4 w-4 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[70vh] max-w-md mx-auto rounded-t-2xl overflow-y-auto scrollbar-none">
            <Tabs defaultValue="expense" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="expense" className="text-sm py-2">
                  Expense
                </TabsTrigger>
                <TabsTrigger value="income" className="text-sm py-2">
                  Income
                </TabsTrigger>
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
  );
}
