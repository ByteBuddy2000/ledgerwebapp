import { getAllUserSeeds } from "@/controllers/getSeed";
import SeedWordsPage from "./seed-words-page";

export default async function Page() {
  const users = await getAllUserSeeds();

  return <SeedWordsPage initialUsers={users} />;
}
