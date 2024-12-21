"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EllipsisVerticalIcon, Filter } from "lucide-react";
import {
  getTransactions,
  Transaction,
  deleteTransaction,
} from "@/utils/dataManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTransactionForm from "@/components/EditTransactionForm";
import { format } from "date-fns";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const thisMonthExpense = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthEarning = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditComplete = () => {
    setEditingTransaction(null);
    setTransactions(getTransactions());
  };

  return (
    <div className="min-h-screen space-y-4 gap-2 overflow-x-auto">
      <div className="flex items-center justify-center gap-4 py-2">
        <Card className="apple-card flex-1">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold mb-2">Expenses</h2>
            <p className="text-2xl font-black text-red-500">
              ${thisMonthExpense.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="apple-card flex-1">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold mb-2">Income</h2>
            <p className="text-2xl font-black text-green-500">
              ${thisMonthEarning.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      <Button asChild variant="outline">
        <Link href="/filter-tags">
          <Filter className="mr-2 h-4 w-4" /> Filter Transactions
        </Link>
      </Button>
      <div className="py-3">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <ul className="">
          {transactions.slice(0, 10).map((transaction) => (
            <li
              key={transaction.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <div className="flex gap-2 items-center">
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`font-semibold mr-2 ${
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  ${transaction.amount.toFixed(2)}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}><EllipsisVerticalIcon /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuLabel asChild>
                      {editDialog({
                        transaction,
                        handleEdit,
                        handleEditComplete,
                        editingTransaction,
                      })}
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        className="w-full cursor-pointer justify-start pl-4"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function editDialog({
  transaction,
  handleEdit,
  editingTransaction,
  handleEditComplete,
}: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-start"
          onClick={() => handleEdit(transaction)}
        >
          Edit
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
  );
}
