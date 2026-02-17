import React from 'react'
import DashboardAssets from '../DashbardAssets/DashboardAssets';


const AssetServer = () => {
    const assets = [
  { name: "Bitcoin", value: "$105,200.00", change: "+1.54%", icon: "₿" },
  { name: "Stellar", value: "$0.25", change: "+7.45%", icon: "★" },
  { name: "Trump Coin", value: "$0.30", change: "+0.88%", icon: "🪙" },
  { name: "Solana", value: "$144.46", change: "+1.83%", icon: "◎" },
  { name: "Ripple", value: "$2.18", change: "+1.16%", icon: "💧" },
  { name: "Algorand", value: "$0.18", change: "+0.84%", icon: "🅐" },
  { name: "Cardano", value: "$0.58", change: "+1.84%", icon: "₳" },
  { name: "Ethereum", value: "$2,415.42", change: "+1.70%", icon: "Ξ" },
  { name: "Litecoin", value: "$84.33", change: "+1.34%", icon: "Ł" },
];

  return (
    <div>
      <DashboardAssets assets={assets} />
    </div>
  )
}

export default AssetServer
