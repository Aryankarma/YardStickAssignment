"use client";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import ExpensesChart from "../../components/ExpensesChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { useState, useEffect, DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from "react";
import { useRouter } from "next/navigation";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  type: "expense" | "income";
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [onOpenChange, setOnOpenChange] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(false);
  const [editingTransactionData, setEditingTransactionData] =
    useState<Transaction>();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const router = useRouter();

  // all functions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        throw new Error("Failed to fetch transactions");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id));
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
      } else {
        throw new Error("Failed to delete transaction");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  // handle edit function
  const handleEdit = async (id: string) => {
    setIsDialogOpen(true);
    setEditingTransaction(true);
  
    const transaction = transactions.find((t) => t._id === id);
  
    if (!transaction) {
      toast({
        title: "Error",
        description: "Transaction not found",
        variant: "destructive",
      });
      return;
    }
  
    setEditingTransactionData(transaction);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setType(transaction.type);
    setDate(new Date(transaction.date));

    try {
      
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          type,
          date,
        }),
      });

      if (res.ok) {
        const updatedTransaction = await res.json();
        setTransactions(
          transactions.map((t) => (t._id === id ? { ...t, ...updatedTransaction } : t))
        );
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      } else {
        throw new Error("Failed to delete transaction");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(editingTransaction) {
      if (editingTransactionData) {
        handleEdit(editingTransactionData._id);
      }
      return;
    }

    if (!amount || !date || !description || !type) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          date,
          description,
          type,
        }),
      });

      if (res.ok) {
        setAmount("");
        setDate(new Date());
        setDescription("");
        setType("expense");
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
        const resp = await res.json();
        setTransactions([
          ...transactions,
          { _id: resp.id, amount: Number(amount), date, type, description },
        ]);
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto overflow-hidden ">
      <div className="flex flex-col items-center space-y-4 p-4 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Personal Finance Visualizer
        </h1>
        <p className="max-w-[600px] text-muted-foreground">
          Track your expenses, visualize your spending patterns, and take
          control of your financial future.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Transactions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </CardHeader>
          <CardContent className="h-[400px] overflow-y-scroll">
            <TransactionList
              setIsDialogOpen={setIsDialogOpen}
              transactions={transactions}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </CardContent>
        </Card>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 p-6">Monthly Expenses</h2>
          <ExpensesChart transactions={transactions} />
        </div>
      </div>
      <TransactionForm
        handleSubmit={handleSubmit}
        editingTransaction={editingTransaction}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        amount={amount}
        date={date}
        description={description}
        type={type}
        setAmount={setAmount}
        setDate={setDate}
        setDescription={setDescription}
        setType={setType}
      />
    </div>
  );
}
