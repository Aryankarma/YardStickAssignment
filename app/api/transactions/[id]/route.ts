import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "../../../../lib/mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(params.id) })
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Transaction deleted successfully" })
    } else {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}

export async function PUT(request: Request, {params} : {params: {id: string}}) {
  try {
    const { db } = await connectToDatabase()
    const { amount, description, date, type, category } = await request.json()
    const result = await db.collection("transactions").updateOne({ _id: new ObjectId(params.id) },  { 
      $set: { 
        amount, 
        description,
        category,
        date: new Date(date), 
        type, 
        updatedAt: new Date()
      } 
    })
    if (result.modifiedCount === 1) {
      console.log(
        "transaction updated successfully"
      )
      return NextResponse.json({ message: "Transaction updated successfully" })
    } else {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}