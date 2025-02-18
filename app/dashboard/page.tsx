"use client";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import ExpensesChart from "../../components/ExpensesChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { useState } from "react";

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
            <TransactionList />
          </CardContent>
        </Card>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 p-6">Monthly Expenses</h2>
          <ExpensesChart />
        </div>
      </div>
      <TransactionForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
