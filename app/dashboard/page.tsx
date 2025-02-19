"use client";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import ExpensesChart from "../../components/ExpensesChart";
import CategoryPieChart from "../../components/CategoryPieChart";
import DashboardSummary from "@components/DashboardSummary";
import SpendingInsights from "@components/SpendingInsights";
import BudgetComparison from "@components/BudgetComparison";
import BudgetForm from "@components/BudgetForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import {
  TransactionCategory,
  Transaction,
  Budget,
} from "../../components/Types";

export default function Dashboard() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(false);
  const [editingTransactionData, setEditingTransactionData] =
    useState<Transaction>();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [category, setCategory] = useState<TransactionCategory>("other");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  useEffect(() => {
    fetchTransactionsAndBudget();
  }, []);

  const handleBudgetSubmit = async (budgetData: Omit<Budget, "_id">) => {
    const existingBudget = budgets.find(
      (b) => b.category === budgetData.category && b.month === budgetData.month
    );

    const method = existingBudget ? "PUT" : "POST";
    const url = existingBudget
      ? `/api/budgets/${existingBudget._id}`
      : "/api/budgets";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      });

      if (res.ok) {
        const updatedBudget = await res.json();

        if (existingBudget) {
          setBudgets((prevBudgets) =>
            prevBudgets.map((b) =>
              b._id === existingBudget._id ? updatedBudget : b
            )
          );
        } else {
          setBudgets((prevBudgets) => [...prevBudgets, updatedBudget]);
        }

        toast({
          title: "Success",
          description: `Budget ${
            existingBudget ? "updated" : "set"
          } successfully`,
        });
      } else {
        throw new Error(
          `Failed to ${existingBudget ? "update" : "set"} budget`
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set budget",
        variant: "destructive",
      });
    }
  };

  const fetchTransactionsAndBudget = async () => {
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ]);

      if (transactionsRes.ok && budgetsRes.ok) {
        const [transactionsData, budgetsData] = await Promise.all([
          transactionsRes.json(),
          budgetsRes.json(),
        ]);

        setTransactions(transactionsData);
        setBudgets(budgetsData);
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
    setCategory(transaction.category);
    setType(transaction.type);
    setDate(new Date(transaction.date));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date || !description || !type) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTransaction && editingTransactionData) {
        const res = await fetch(
          `/api/transactions/${editingTransactionData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: Number(amount),
              date,
              category,
              description,
              type,
            }),
          }
        );

        if (res.ok) {
          setTransactions((prevTransactions) =>
            prevTransactions.map((t) =>
              t._id === editingTransactionData._id
                ? {
                    ...t,
                    amount: Number(amount),
                    date,
                    description,
                    category,
                    type,
                    updatedAt: new Date(),
                  }
                : t
            )
          );
          toast({
            title: "Success",
            description: "Transaction updated successfully",
          });
        } else {
          throw new Error("Failed to update transaction");
        }
      } else {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(amount),
            date,
            description,
            category,
            type,
          }),
        });

        if (res.ok) {
          const resp = await res.json();
          setTransactions([
            ...transactions,
            {
              _id: resp.id,
              amount: Number(amount),
              date,
              type,
              description,
              category,
            },
          ]);
          toast({
            title: "Success",
            description: "Transaction added successfully",
          });
        } else {
          throw new Error("Failed to add transaction");
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: editingTransaction
          ? "Failed to update transaction"
          : "Failed to add transaction",
        variant: "destructive",
      });
    }
    // Reset form
    setAmount("");
    setDate(new Date());
    setDescription("");
    setType("expense");
    setCategory("other");
    setEditingTransaction(false);
    setEditingTransactionData(undefined);
  };

  return (
    <div className="container mx-auto overflow-hidden sm:0 px-6">
       <div className="flex align-center justify-between py-2 text-center">
        <div>
          <h1 className="text-2xl text-start  font-bold">
            Personal Finance Visualizer
          </h1>
          <p className="max-w-[700px] text-start text-muted-foreground text-sm">
            Track your expenses, visualize your spending patterns, and take
            control of your financial future.
          </p>
        </div>
        <div className="flex align-center ">
          <Button variant="outline" size="sm" onClick={() => setIsBudgetDialogOpen(true)}>
            Set Monthly Budget
          </Button>
        </div>
      </div>

      <DashboardSummary transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
        <div className="h-[400px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl md:text-2xl">Transactions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAmount("");
                  setDate(new Date());
                  setDescription("");
                  setType("expense");
                  setEditingTransaction(false);
                  setEditingTransactionData(undefined);
                  setIsDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-scroll pb-4">
              <TransactionList
                setIsDialogOpen={setIsDialogOpen}
                transactions={transactions}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm h-[400px]">
          <ExpensesChart transactions={transactions} />
        </div>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm h-[400px]">
          <CategoryPieChart transactions={transactions} />
        </div>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm h-[400px]">
          <SpendingInsights transactions={transactions} budgets={budgets} />
        </div>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm h-[400px]">
          <CategoryPieChart transactions={transactions} />
        </div>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm h-[400px]">
          <BudgetComparison transactions={transactions} budgets={budgets} />
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
        category={category}
        setCategory={setCategory}
      />
      <BudgetForm
        open={isBudgetDialogOpen}
        setOpen={setIsBudgetDialogOpen}
        onSubmit={handleBudgetSubmit}
      />
    </div>
  );
}
