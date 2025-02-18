"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { toast } from "./ui/use-toast"
import { DeleteIcon } from "lucide-react"
import { Trash } from "lucide-react"

interface Transaction {
  _id: string
  amount: number
  date: string
  description: string
  type: string
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(()=>{
    console.log("transactions: ", transactions)
  },[transactions])

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions")
      if (res.ok) {
        const data = await res.json()
        setTransactions(data)
      } else {
        throw new Error("Failed to fetch transactions")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id))
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
      } else {
        throw new Error("Failed to delete transaction")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

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
              ${Math.abs(transaction.amount).toFixed(0)}
            </p>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction._id)}>
              <Trash />
            </Button>
          </div>
        </div>
      )))}
    </div>
  )
}

