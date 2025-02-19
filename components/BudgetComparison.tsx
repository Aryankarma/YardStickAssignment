"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Transaction, Budget, TransactionCategory } from "./Types";


interface BudgetComparisonProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function BudgetComparison({ transactions, budgets }: BudgetComparisonProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === "expense" && t.date && new Date(t.date).toISOString().slice(0, 7) === currentMonth)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

  const data = budgets
    .filter(b => b.month === currentMonth)
    .map(budget => ({
      category: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
      budget: budget.amount,
      spent: monthlyExpenses[budget.category] || 0,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="spent" fill="#82ca9d" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}