import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const budgets = await db.collection("budgets").find({}).toArray();
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
      const { db } = await connectToDatabase();
      const budgetData = await request.json();
      
      const existingBudget = await db.collection("budgets").findOne({
        category: budgetData.category,
        month: budgetData.month
      });
  
      if (existingBudget) {
        const result = await db.collection("budgets").updateOne(
          { _id: existingBudget._id },
          { $set: budgetData }
        );
        return NextResponse.json({ ...budgetData, _id: existingBudget._id });
      } else {
        const result = await db.collection("budgets").insertOne(budgetData);
        return NextResponse.json({ ...budgetData, _id: result.insertedId });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create/update budget" },
        { status: 500 }
      );
    }
  }
  
  