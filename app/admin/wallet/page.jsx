import WalletPage from "./WalletPage"
import { getUsersWithAssets } from "@/controllers/getUsersandAssets"

export default async function Page() {
  const users = await getUsersWithAssets()
  return <WalletPage users={users} />
}