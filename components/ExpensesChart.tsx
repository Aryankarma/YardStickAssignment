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
import { MonthlyAggregate } from "./Types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

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
  const [monthlyData, setMonthlyData] = useState<MonthlyAggregate[]>([]);

  useEffect(() => {
    const aggregatedData = getMonthlyData(transactions);
    setMonthlyData(aggregatedData);
  }, [transactions]);

  const getMonthlyData = (transactions: Transaction[]): MonthlyAggregate[] => {
    return transactions.reduce((acc: MonthlyAggregate[], transaction) => {
      const month = transaction?.date
        ? format(new Date(transaction.date), "MMM d, yyyy")
        : "N/A";

      const existingMonthIndex = acc.findIndex((item) => item.month === month);

      if (existingMonthIndex !== -1) {
        const updatedMonth = { ...acc[existingMonthIndex] };
        if (transaction.type === "expense") {
          updatedMonth.expenses += transaction.amount;
        } else {
          updatedMonth.income += transaction.amount;
        }

        return [
          ...acc.slice(0, existingMonthIndex),
          updatedMonth,
          ...acc.slice(existingMonthIndex + 1),
        ];
      } else {
        return [
          ...acc,
          {
            month,
            expenses: transaction.type === "expense" ? transaction.amount : 0,
            income: transaction.type === "income" ? transaction.amount : 0,
          },
        ];
      }
    }, []);
  };

  useEffect(() => {
    console.log("monthlyData: ", monthlyData);
  }, [monthlyData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                <Bar
                  dataKey="income"
                  fill="hsl(var(--chart-2))"
                  name="Income"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
