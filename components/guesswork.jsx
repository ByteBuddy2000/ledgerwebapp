import Image from "next/image";

export default function InvestWithoutGuesswork() {
    return (
        <section className="bg-black text-white py-28 px-6">
            <div className="max-w-7xl mx-auto text-center">

                {/* Heading */}
                <h2 className="text-5xl font-semibold mb-4">
                    Invest without guesswork
                </h2>
                <p className="text-gray-400 mb-16 text-base">
                    Leverage smart automation and data-driven insights to make informed decisions.
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

                    {/* Transactions Automation */}
                    <div className="bg-[#0b0b12] border border-[#1f1f2a] rounded-2xl p-7">
                        <h3 className="text-lg font-semibold mb-2">
                            Transactions automation
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Put all your crypto transfers on auto-pilot. Make it easy and effortless to track all your investments.
                        </p>

                        <div className="flex justify-between text-sm text-gray-400 mb-3">
                            <span>Latest transactions</span>
                            <span className="cursor-pointer">Show all →</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-[#111118] rounded-xl px-4 py-3 text-sm text-gray-300">
                                <span>0x8L9522CA3Fq83...</span>
                                <span>Feb 2024</span>
                                <span>$1,352</span>
                            </div>

                            <div className="flex justify-between items-center bg-[#111118] rounded-xl px-4 py-3 text-sm text-gray-300">
                                <span>0x3D459524F2a9...</span>
                                <span>Oct 2024</span>
                                <span>$250</span>
                            </div>
                        </div>
                    </div>

                    {/* All-in-one integrations */}
                    <div className="bg-[#0b0b12] border border-[#1f1f2a] rounded-2xl p-7 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 mb-6"></div>
                            <h3 className="text-lg font-semibold mb-2">
                                All-in-one integrations
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Connect to 70+ enterprise payment systems just in one click.
                            </p>
                        </div>
                    </div>

                    {/* Investments analytics */}
                    <div className="bg-[#0b0b12] border border-[#1f1f2a] rounded-2xl p-7">
                        <div className="mb-6">
                            <Image
                                src="/guesslogo.png"
                                alt="Analytics illustration"
                                width={120}
                                height={80}
                                className="object-contain"
                            />
                        </div>            <h3 className="text-lg font-semibold mb-2">
                            Investments analytics
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Review all your transactions and track the payments history in one tailored hub.
                        </p>
                    </div>

                    {/* Performance */}
                    <div className="bg-[#0b0b12] border border-[#1f1f2a] rounded-2xl p-7 flex flex-col justify-between">

                        <div className="flex justify-between items-center mb-6">
                            <span className="font-medium">Performance</span>
                            <div className="flex gap-3 text-xs text-gray-400">
                                <span>1D</span>
                                <span>1W</span>
                                <span className="text-white font-semibold">1M</span>
                                <span>1Y</span>
                            </div>
                        </div>

                        {/* Bars */}
                        <div className="flex items-end gap-2 h-16 mb-6">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 ${i % 4 === 0
                                            ? "h-14"
                                            : i % 3 === 0
                                                ? "h-10"
                                                : "h-8"
                                        }`}
                                />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">
                                Keep your portfolio on track
                            </h4>
                            <p className="text-gray-400 text-sm">
                                Set up your investment goals and track the efficiency throughout the defined period of time, make sure you are on track.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
