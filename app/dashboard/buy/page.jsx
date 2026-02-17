import Image from "next/image";
import Link from "next/link";
import NavHeader from "../components/NavHeader/NavHeader";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 pb-16">
      <NavHeader />
      <div className="mt-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Buy & Deposit Crypto</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
          {/* Ramp */}
          <Link
            href="https://ramp.network/buy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl shadow-md hover:shadow-xl transition p-6 h-48 hover:border-blue-500"
          >
            <Image src="/buyImg/ramp.png" width={50} height={50} alt="Ramp" />
            <h2 className="text-base sm:text-lg font-semibold pt-3 text-white">Ramp</h2>
            <p className="text-xs text-slate-400 mt-1 text-center">Buy crypto with your card</p>
          </Link>

          {/* Transak */}
          <Link
            href="https://global.transak.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl shadow-md hover:shadow-xl transition p-6 h-48 hover:border-blue-500"
          >
            <Image src="/buyImg/transak.png" width={50} height={50} alt="Transak" />
            <h2 className="text-base sm:text-lg font-semibold pt-3 text-white">Transak</h2>
            <p className="text-xs text-slate-400 mt-1 text-center">Pay via bank, Apple Pay, etc.</p>
          </Link>

          {/* Gift Card */}
          <Link
            href="/dashboard/buy/gift-card-deposit"
            className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl shadow-md hover:shadow-xl transition p-6 h-48 hover:border-blue-500"
          >
            <Image src="/buyImg/giftcard.png" width={50} height={50} alt="Gift Card" />
            <h2 className="text-base sm:text-lg font-semibold pt-3 text-white text-center leading-tight">
              Redeem<br />Gift Card
            </h2>
            <p className="text-xs text-slate-400 mt-1 text-center">Use gift card balance</p>
          </Link>

          {/* Moonpay */}
          <Link
            href="https://moonpay.com/buy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl shadow-md hover:shadow-xl transition p-6 h-48 hover:border-blue-500"
          >
            <Image src="/buyImg/moonpay.png" width={50} height={50} alt="Moonpay" />
            <h2 className="text-base sm:text-lg font-semibold pt-3 text-white">Moonpay</h2>
            <p className="text-xs text-slate-400 mt-1 text-center">Quick card & bank transfers</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
