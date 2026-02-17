import { NextResponse } from "next/server";
import { getAllcustomer } from "@/controllers/getAllcustomer";

export async function GET() {
  const users = await getAllcustomer();
  return NextResponse.json({ customers: users });
}