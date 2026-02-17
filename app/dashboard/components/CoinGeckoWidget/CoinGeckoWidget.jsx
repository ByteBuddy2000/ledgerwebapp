"use client";
import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const CoinGeckoWidget = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically load the CoinGecko widget script once on mount
    if (!document.getElementById('gecko-coin-list-widget')) {
      const script = document.createElement('script');
      script.id = 'gecko-coin-list-widget';
      script.src = 'https://widgets.coingecko.com/gecko-coin-list-widget.js';
      script.async = true;
      script.onload = () => setLoading(false);
      document.body.appendChild(script);
    } else {
      setLoading(false);
    }
    // Fallback: hide skeleton after 2s in case script doesn't fire onload
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-1 w-full max-w-full overflow-x-auto">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">Live Crypto Prices</h2>
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-[300px] w-full">
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td className="py-2">
                    <Skeleton className="h-4 w-full max-w-[120px] rounded" />
                  </td>
                  <td className="py-2">
                    <Skeleton className="h-4 w-full max-w-[80px] rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* CoinGecko Coin List Widget */}
          <div className="w-full overflow-x-auto">
            <gecko-coin-list-widget
              locale="en"
              outlined="true"
              coin-ids="bitcoin,stellar,donald-trump,solana,ripple,algorand,cardano,ethereum,litecoin"
              initial-currency="usd"
              style={{ width: '100%', minWidth: '300px' }}
            ></gecko-coin-list-widget>
          </div>
          <div className="hidden text-xs text-gray-400 mt-2">
            Powered by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="underline">CoinGecko</a>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinGeckoWidget;