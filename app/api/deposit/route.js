import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import Deposit from "@/models/Deposit"; // You need to create this model

export async function POST(req) {
  await connectToDB();
  const data = await req.json();

  // Save deposit info, including attachmentUrl
  const deposit = await Deposit.create({
    ...data,
    // e.g. userId: data.userId,
    // amount: data.amount,
    // attachmentUrl: data.attachmentUrl,
  });

  return NextResponse.json({ success: true, deposit });
}