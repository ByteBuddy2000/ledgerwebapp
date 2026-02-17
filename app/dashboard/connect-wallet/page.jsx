import NavHeader from "../components/NavHeader/NavHeader";
import ConnectWallet from "./ConnectWallet";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pb-8">
      <NavHeader />
      <div className="max-w-5xl mx-auto px-4">
        <ConnectWallet />
      </div>
    </div>
  );
}

