import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

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

