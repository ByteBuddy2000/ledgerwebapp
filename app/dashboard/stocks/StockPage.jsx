// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

// const mockStocks = [
//   {
//     symbol: "AAPL",
//     name: "Apple Inc.",
//     price: 192.32,
//     change: 1.25,
//     shares: 10,
//     logo: "https://logo.clearbit.com/apple.com",
//   },
//   {
//     symbol: "TSLA",
//     name: "Tesla Inc.",
//     price: 172.88,
//     change: -2.14,
//     shares: 5,
//     logo: "https://logo.clearbit.com/tesla.com",
//   },
//   {
//     symbol: "GOOGL",
//     name: "Alphabet Inc.",
//     price: 156.77,
//     change: 0.56,
//     shares: 2,
//     logo: "https://logo.clearbit.com/google.com",
//   },
//   {
//     symbol: "AMZN",
//     name: "Amazon.com Inc.",
//     price: 184.21,
//     change: 3.12,
//     shares: 0,
//     logo: "https://logo.clearbit.com/amazon.com",
//   },
// ];

// export default function StockPage() {
//   const [stocks, setStocks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Simulate fetch
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setStocks(mockStocks);
//       setLoading(false);
//     }, 1200);
//   }, []);

//   const handleBuy = (symbol) => {
//     // Replace with real buy logic
//     alert(`Buy shares of ${symbol}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-10 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8 text-center">
//           <LineChart className="mx-auto mb-2 text-blue-400" size={40} />
//           <h1 className="text-3xl font-bold text-white mb-2">Stocks Marketplace</h1>
//           <p className="text-slate-300">
//             Buy and track stocks alongside your crypto assets.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {loading
//             ? Array.from({ length: 4 }).map((_, i) => (
//                 <Card key={i} className="bg-white/5 backdrop-blur-md rounded-2xl animate-pulse border border-white/10 p-6">
//                   <div className="h-5 w-24 bg-blue-700/40 rounded mb-4"></div>
//                   <div className="h-6 w-36 bg-blue-800/40 rounded mb-2"></div>
//                   <div className="h-4 w-20 bg-blue-600/40 rounded"></div>
//                 </Card>
//               ))
//             : stocks.map((stock) => {
//                 const isUp = stock.change > 0;
//                 const changeColor = isUp ? "text-green-400" : stock.change < 0 ? "text-red-400" : "text-gray-400";
//                 const changeIcon = isUp ? <ArrowUpRight size={16} /> : stock.change < 0 ? <ArrowDownRight size={16} /> : null;
//                 return (
//                   <Card
//                     key={stock.symbol}
//                     className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10 backdrop-blur-md p-5 text-white rounded-2xl shadow-lg transition hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
//                   >
//                     <CardHeader className="flex items-center gap-3 p-0 mb-3">
//                       <img
//                         src={stock.logo}
//                         alt={stock.symbol}
//                         className="w-10 h-10 object-contain rounded-full border border-white/10 shadow"
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = "/stock-placeholder.png";
//                         }}
//                       />
//                       <div>
//                         <h4 className="text-lg font-semibold flex items-center gap-2">
//                           {stock.symbol}
//                         </h4>
//                         <p className="text-xs text-blue-300">{stock.name}</p>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-0 mt-2">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="text-xs text-blue-300">
//                           Price: ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </p>
//                         <span className={`ml-2 ${changeColor} font-semibold flex items-center gap-1`}>
//                           {changeIcon}
//                           <span>{stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%</span>
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between mt-2">
//                         <span className="text-xs text-white/70">
//                           Owned: <span className="font-bold">{stock.shares}</span> shares
//                         </span>
//                         <button
//                           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded transition text-xs"
//                           onClick={() => handleBuy(stock.symbol)}
//                         >
//                           Buy
//                         </button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//         </div>
//       </div>
//     </div>
//   );
// }

// list of shares
// 🧠 Technology
// Symbol	Company Name
// MSFT	Microsoft Corporation
// NVDA	NVIDIA Corporation
// META	Meta Platforms Inc (Facebook)
// AMD	Advanced Micro Devices Inc
// INTC	Intel Corporation
// ORCL	Oracle Corporation
// IBM	International Business Machines Corp
// CRM	Salesforce Inc

// 💳 Finance & Banking
// Symbol	Company Name
// JPM	JPMorgan Chase & Co
// BAC	Bank of America Corp
// WFC	Wells Fargo & Co
// GS	Goldman Sachs Group Inc
// C	Citigroup Inc
// MS	Morgan Stanley
// PYPL	PayPal Holdings Inc
// V	Visa Inc
// MA	Mastercard Incorporated


// 🛒 Consumer & Retail
// Symbol	Company Name
// WMT	Walmart Inc
// COST	Costco Wholesale Corp
// TGT	Target Corp
// NKE	Nike Inc
// HD	Home Depot Inc
// SBUX	Starbucks Corp
// MCD	McDonald’s Corp
// KO	Coca-Cola Co
// PEP	PepsiCo Inc

// ⚡ Energy & Utilities
// Symbol	Company Name
// XOM	Exxon Mobil Corp
// CVX	Chevron Corp
// NEE	NextEra Energy Inc
// BP	BP plc
// SHEL	Shell plc
// COP	ConocoPhillips

// 🚗 Automotive & Transport
// Symbol	Company Name
// F	Ford Motor Co
// GM	General Motors Co
// RIVN	Rivian Automotive Inc
// UBER	Uber Technologies Inc
// LYFT	Lyft Inc

// 💊 Healthcare & Pharma
// Symbol	Company Name
// JNJ	Johnson & Johnson
// PFE	Pfizer Inc
// MRK	Merck & Co Inc
// ABBV	AbbVie Inc
// UNH	UnitedHealth Group Inc
// TMO	Thermo Fisher Scientific Inc

// 🎬 Entertainment & Media
// Symbol	Company Name
// DIS	The Walt Disney Company
// NFLX	Netflix Inc
// WBD	Warner Bros. Discovery Inc
// SONY	Sony Group Corp
// RBLX	Roblox Corporation

// ☁️ Other Growth & Innovation
// Symbol	Company Name
// SNOW	Snowflake Inc
// SHOP	Shopify Inc
// SQ	Block Inc (formerly Square)
// PLTR	Palantir Technologies Inc
// ABNB	Airbnb Inc
// U	Unity Software Inc

// Qz Gold Qz Silver Oz Palladium Oz Iridium Qz Copper

