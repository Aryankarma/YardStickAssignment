"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface TransactionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  amount: string;
  date: Date;
  description: string;
  type: "expense" | "income";
  editingTransaction: boolean;
  setAmount: (amount: string) => void;
  setDate: (date: Date) => void;
  setDescription: (description: string) => void;
  setType: (type: "expense" | "income") => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function TransactionForm({
  open,
  setOpen,
  amount,
  date,
  description,
  type,
  editingTransaction,
  setAmount,
  setDate,
  setDescription,
  setType,
  handleSubmit,
}: TransactionFormProps) {
  const router = useRouter();

  function onOpenChange(open: boolean) {
    setOpen(open); 
    if (!open) {
      router.push("/dashboard");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "expense" | "income")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="1"
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>
          <Button type="submit">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
