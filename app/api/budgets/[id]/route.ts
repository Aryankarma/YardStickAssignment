import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const budgetData = await request.json();
    
    const result = await db.collection("budgets").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: budgetData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...budgetData, _id: params.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}