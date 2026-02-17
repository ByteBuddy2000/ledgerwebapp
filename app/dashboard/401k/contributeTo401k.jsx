"use client";

import { useState, useTransition, useEffect } from "react";
import NavHeader from "../components/NavHeader/NavHeader";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const coins = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tether", label: "USDT" },
  { value: "binancecoin", label: "BNB" },
  { value: "solana", label: "Solana" },
  { value: "cardano", label: "Cardano" },
  { value: "ripple", label: "Ripple" },
  { value: "dogecoin", label: "Dogecoin" },
  { value: "trx", label: "TRX" },
  { value: "dot", label: "Polkadot" },
  { value: "shib", label: "SHIB" },
];

// Map CoinGecko slug to symbol for backend
const coinSymbolMap = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  binancecoin: "BNB",
  solana: "SOL",
  cardano: "ADA",
  ripple: "XRP",
  dogecoin: "DOGE",
  trx: "TRX",
  dot: "DOT",
  shib: "SHIB",
};

export default function FourZeroOnePage({ contributeTo401k }) {
  const [contribution, setContribution] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(coins[0].value);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  // State for recent contributions
  const [recent, setRecent] = useState([]);
  // State for balance and YTD
  const [currentBalance, setCurrentBalance] = useState(0);
  const [ytd, setYtd] = useState(0);

  // Fetch recent contributions, balance, and YTD
  useEffect(() => {
    async function fetchStats() {
      try {
        const [recentRes, balRes, ytdRes] = await Promise.all([
          fetch("/api/401kContribution?recent=true"),
          fetch("/api/401kContribution?balance=true"),
          fetch("/api/401kContribution?ytd=true"),
        ]);
        const recentData = await recentRes.json();
        const balData = await balRes.json();
        const ytdData = await ytdRes.json();
        setRecent(recentData.success ? recentData.contributions : []);
        setCurrentBalance(balData.success ? balData.balance : 0);
        setYtd(ytdData.success ? ytdData.ytd : 0);
      } catch {
        setRecent([]);
        setCurrentBalance(0);
        setYtd(0);
      }
    }
    fetchStats();
  }, [open, pending]);

  function handleContribution(e) {
    e.preventDefault();
    startTransition(async () => {
      const result = await contributeTo401k({
        amount: Number(contribution),
        coin: coinSymbolMap[selectedCoin], // <-- use symbol for backend
      });

      if (result.success) {
        toast.success("Contribution successful!");
        setContribution("");
        setOpen(false);
      } else {
        toast.error(result.error || "Contribution failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 pb-12">
      <Toaster richColors position="top-center" />
      <NavHeader />

      <div className="max-w-5xl mx-auto my-8 bg-card border border-border rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">401(k) Retirement Account</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-8">
          Your 401(k) is a retirement savings plan sponsored by your employer. It lets you save and invest a portion of
          your paycheck before taxes are taken out. Taxes aren't paid until the money is withdrawn from the account.
        </p>
        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg shadow hover:from-blue-500 hover:to-blue-700 transition"
                onClick={() => setOpen(true)}
              >
                Make a Contribution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-400 mb-2">Make a Contribution</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</Button>
                </DialogClose>
              </DialogHeader>
              <form onSubmit={handleContribution} className="flex flex-col gap-5 mt-2">
                <div>
                  <Label htmlFor="coin" className="text-blue-300 mb-1 block">Select Payment Method</Label>
                  <Select value={selectedCoin} onValueChange={setSelectedCoin} disabled={pending}>
                    <SelectTrigger className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select coin" />
                    </SelectTrigger>
                    <SelectContent>
                      {coins.map(coin => (
                        <SelectItem key={coin.value} value={coin.value}>
                          <span className="flex items-center gap-2">
                            <img
                              src={`/cryptocoin/${coin.value}.svg`}
                              alt={coin.label}
                              className="w-5 h-5 object-contain"
                              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `/cryptocoin/${coin.value}.png`; }}
                            />
                            {coin.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contribution" className="text-blue-300 mb-1 block">Amount</Label>
                  <Input
                    id="contribution"
                    type="number"
                    min="0.0001"
                    step="any"
                    value={contribution}
                    onChange={e => setContribution(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white w-full focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={pending}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg shadow hover:from-blue-500 hover:to-blue-700 transition mt-2"
                  disabled={pending}
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : "Contribute"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="hidden bg-gradient-to-r from-green-600 to-green-800 text-white px-5 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 transition">
            Adjust Investments
          </Button>
          <Button className="hidden bg-slate-700 text-slate-300 px-5 py-2 rounded-lg hover:bg-slate-600 transition">
            View Statements
          </Button>
        </div>

        {/* Investment Allocation */}
        <div className="hidden my-10">
          <h2 className="text-lg font-semibold text-blue-300 mb-3">Investment Allocation</h2>
          <div className="w-full bg-slate-700 rounded overflow-hidden h-6 flex">
            <div className="bg-blue-500 h-6" style={{ width: "50%" }} title="US Stocks" />
            <div className="bg-green-500 h-6" style={{ width: "30%" }} title="International Stocks" />
            <div className="bg-yellow-400 h-6" style={{ width: "15%" }} title="Bonds" />
            <div className="bg-gray-400 h-6" style={{ width: "5%" }} title="Cash" />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400 mt-2">
            <span>US Stocks (50%)</span>
            <span>International (30%)</span>
            <span>Bonds (15%)</span>
            <span>Cash (5%)</span>
          </div>
        </div>

        {/* Account Summary Table */}
        <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-700">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">Statistics Summary</h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-white">Current Balance</TableCell>
                  <TableCell className="text-slate-300">
                    ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-white">Year-to-Date Contributions</TableCell>
                  <TableCell className="text-slate-300">
                    ${ytd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow></TableRow>
                
              </TableBody>
            </Table>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-700">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">Recent Employees Activity</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300">Activity</TableHead>
                  <TableHead className="text-slate-300">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-400">
                      No recent contributions.
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>Contribution ({tx.coin})</TableCell>
                      <TableCell className="text-green-400">
                        +{tx.amount} {tx.coin}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}