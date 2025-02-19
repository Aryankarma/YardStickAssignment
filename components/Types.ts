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
  category: TransactionCategory; // New field
  createdAt?: Date;
  updatedAt?: Date;
}