import { getAllUserSeeds } from "@/controllers/getSeed";

export async function GET() {
  try {
    const users = await getAllUserSeeds();
    return Response.json({ users });
  } catch (err) {
    return Response.json({ users: [], error: err.message }, { status: 500 });
  }
}