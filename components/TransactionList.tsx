"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { toast } from "./ui/use-toast"
import { Trash, PenIcon } from "lucide-react"

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  type: "expense" | "income";
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  setEditingTransactionID: (id: string) => void;
}

export default function TransactionList({transactions, handleEdit, handleDelete, setEditingTransactionID } : TransactionListProps) {

  return (
    <div className="space-y-4 flex flex-col pb-auto justify-start items-center h-full">
      {transactions.length === 0 ? (
        <div className="h-full flex justify-center items-center">
          <p className="text-muted-foreground text-center">No transactions found</p>
        </div>
      ) : (transactions.map((transaction) => (
        <div key={transaction._id} className="w-full flex justify-between p-4 bg-white shadow rounded">
          <div>
            <p className="font-semibold">{transaction.description}</p>
            <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        <div className="flex items-center space-x-2">
            <p className={`font-bold ${transaction.type  == "expense" ? "text-red-500" : "text-green-500"}`}>
              ${Math.abs(Number(transaction.amount)).toFixed(0)}
            </p>
            <Button variant="secondary" size="sm" onClick={() => handleEdit(transaction._id)}>
              <PenIcon />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction._id)}>
              <Trash />
            </Button>
          </div>
        </div>
      )))}
    </div>
  )
}

