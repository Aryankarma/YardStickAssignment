"use client";
import {
  Transaction,
  Budget,
  SpendingInsight,
  TransactionCategory,
} from "./Types";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export default function SpendingInsights({
  transactions,
  budgets,
}: SpendingInsightsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const generateInsights = (): SpendingInsight[] => {
    const insights: SpendingInsight[] = [];

    // Calculate monthly spending by category
    const monthlyExpenses = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.date &&
          new Date(t.date).toISOString().slice(0, 7) === currentMonth
      )
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<TransactionCategory, number>);

    // Compare with budgets
    budgets
      .filter((b) => b.month === currentMonth)
      .forEach((budget) => {
        const spent = monthlyExpenses[budget.category] || 0;
        const percentageUsed = (spent / budget.amount) * 100;

        if (percentageUsed >= 90) {
          insights.push({
            message: `You've used ${percentageUsed.toFixed(0)}% of your ${
              budget.category
            } budget`,
            type: "warning",
            category: budget.category,
          });
        }
      });

    // Find top spending category
    const topCategory = Object.entries(monthlyExpenses).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (topCategory) {
      insights.push({
        message: `Your highest spending category is ${
          topCategory[0]
        } (₹${topCategory[1].toLocaleString()})`,
        type: "info",
      });
    }

    // Check for categories without budget
    const categoriesWithoutBudget = Object.keys(monthlyExpenses).filter(
      (category) =>
        !budgets.some(
          (b) => b.month === currentMonth && b.category === category
        )
    );

    if (categoriesWithoutBudget.length > 0) {
      insights.push({
        message: `You haven't set budgets for: ${categoriesWithoutBudget.join(
          ", "
        )}`,
        type: "info",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-scroll gap-2 flex flex-col">
          {insights.map((insight, index) => (
            <Alert
              key={index}
              variant={insight.type === "warning" ? "destructive" : "default"}
            >
              {insight.type === "warning" && (
                <AlertCircle className="h-4 w-4" />
              )}
              {insight.type === "success" && (
                <CheckCircle className="h-4 w-4" />
              )}
              {insight.type === "info" && <Info className="h-4 w-4" />}
              <AlertTitle>Spending Insight</AlertTitle>
              <AlertDescription>{insight.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
