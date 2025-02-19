export type TransactionCategory =
  | "food"
  | "transportation"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "healthcare"
  | "education"
  | "housing"
  | "other"
  | "income";

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  type: "expense" | "income";
  category: TransactionCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MonthlyAggregate {
  month: string;
  expenses: number;
  income: number;
}

export interface Budget {
  _id: string;
  category: TransactionCategory;
  amount: number;
  month: string;
}

export interface SpendingInsight {
  message: string;
  type: "warning" | "success" | "info";
  category?: TransactionCategory;
}