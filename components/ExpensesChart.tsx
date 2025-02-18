"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "./ui/use-toast";
import { format } from "date-fns";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  type: "expense" | "income";
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ExpensesChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const month = transaction?.date
      ? format(new Date(transaction?.date), "MMM d, yyyy")
      : "N/A";
    const existingMonth = acc.find((item) => item.month === month);

    if (existingMonth) {
      if (transaction.type === "expense") {
        existingMonth.expenses += transaction.amount;
      } else {
        existingMonth.income += transaction.amount;
      }
    } else {
      acc.push({
        month,
        expenses: transaction.type === "expense" ? transaction.amount : 0,
        income: transaction.type === "income" ? transaction.amount : 0,
      });
    }

    return acc;
  }, []);

  return (
    <div className="h-[400px] w-full px-4">
      {transactions.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Add transactions to see your monthly breakdown
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="expenses"
              fill="hsl(var(--destructive))"
              name="Expenses"
            />
            <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
