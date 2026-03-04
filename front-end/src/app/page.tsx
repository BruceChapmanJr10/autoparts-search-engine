"use client";

import { useState, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {

    const [query, setQuery] = useState("");

    const [vehicle, setVehicle] = useState({
        year: "",
        make: "",
        model: "",
        engine: "",
        trim: "",
        part: ""
    });

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState("low");

    // NEW: Source filters
    const [showAmazon, setShowAmazon] = useState(true);
    const [showEbay, setShowEbay] = useState(true);

    async function searchKeyword() {
        if (!query) return;

        setLoading(true);

        const res = await fetch(
            `${API_URL}/api/search?query=${query}`
        );

        const data = await res.json();
        setResults(data);
        setLoading(false);
    }

    async function searchVehicle() {
        if (!vehicle.part) return;

        setLoading(true);

        const res = await fetch(`${API_URL}/api/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                year: parseInt(vehicle.year),
                make: vehicle.make,
                model: vehicle.model,
                engine: vehicle.engine,
                trim: vehicle.trim,
                part: vehicle.part
            })
        });

        const data = await res.json();
        setResults(data);
        setLoading(false);
    }

    // Filter by source first
    const filteredResults = useMemo(() => {
        return results.filter(item => {
            if (item.source === "AMAZON" && !showAmazon) return false;
            if (item.source === "EBAY" && !showEbay) return false;
            return true;
        });
    }, [results, showAmazon, showEbay]);

    // Then sort
    const sortedResults = useMemo(() => {
        return [...filteredResults].sort((a, b) =>
            sortOption === "low"
                ? (a.totalPrice ?? 0) - (b.totalPrice ?? 0)
                : (b.totalPrice ?? 0) - (a.totalPrice ?? 0)
        );
    }, [filteredResults, sortOption]);

    const lowestPrice =
        sortedResults.length > 0
            ? Math.min(...sortedResults.map(r => r.totalPrice))
            : 0;

    function getPriceDifference(price: number) {
        const diff = price - lowestPrice;
        return diff > 0 ? diff.toFixed(2) : null;
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-16">

            {/* HERO */}
            <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Find the Best Price on Auto Parts
                    </h1>

                    <p className="text-blue-100 text-lg mb-10">
                        Compare prices from multiple marketplaces instantly
                    </p>

                    <div className="bg-white rounded-xl shadow-xl p-6 text-black">

                        <div className="grid md:grid-cols-3 gap-3 mb-4">
                            {["year","make","model","engine","trim","part"].map((field) => (
                                <input
                                    key={field}
                                    className="border p-3 rounded"
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    value={(vehicle as any)[field]}
                                    onChange={(e) =>
                                        setVehicle({ ...vehicle, [field]: e.target.value })
                                    }
                                />
                            ))}
                        </div>

                        <button
                            onClick={searchVehicle}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                        >
                            Search Parts
                        </button>

                    </div>
                </div>
            </section>

            {/* FILTERS + SORT */}
            {results.length > 0 && (
                <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-wrap gap-4 justify-between items-center">

                    {/* Source Toggles */}
                    <div className="flex gap-4">

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showAmazon}
                                onChange={() => setShowAmazon(!showAmazon)}
                            />
                            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                AMAZON
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showEbay}
                                onChange={() => setShowEbay(!showEbay)}
                            />
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                EBAY
                            </span>
                        </label>

                    </div>

                    {/* Sort */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>

                </div>
            )}

            {/* RESULTS */}
            <section className="max-w-6xl mx-auto px-6 mt-8 grid md:grid-cols-3 gap-6">

                {loading && (
                    <div className="col-span-full text-center text-gray-500">
                        Searching for parts...
                    </div>
                )}

                {sortedResults.map((item, i) => {

                    const isBest = item.totalPrice === lowestPrice;

                    return (
                        <div
                            key={i}
                            className={`bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden ${
                                isBest ? "ring-4 ring-green-500" : ""
                            }`}
                        >

                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-5">

                                <div className="flex justify-between items-center mb-2">

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                            item.source === "AMAZON"
                                                ? "bg-yellow-400 text-black"
                                                : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        {item.source}
                                    </span>

                                    {item.shippingCost === 0 && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                            Free Shipping
                                        </span>
                                    )}

                                </div>
                                {item.exactMatch && (
                                    <div className="text-xs bg-green-600 text-white px-2 py-1 rounded mb-2 inline-block">
                                        Exact Fit
                                    </div>
                                )}
                                <h3 className="font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    ${(item.totalPrice ?? 0).toFixed(2)}
                                </div>

                                {!isBest && (
                                    <div className="text-sm text-red-500 font-semibold mb-2">
                                        +${getPriceDifference(item.totalPrice)} more
                                    </div>
                                )}

                                <a
                                    href={item.productUrl}
                                    target="_blank"
                                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                                >
                                    View Listing
                                </a>

                            </div>
                        </div>
                    );
                })}

            </section>

        </main>
    );
}