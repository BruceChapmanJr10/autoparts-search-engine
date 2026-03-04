"use client";

import { useState } from "react";

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

        const res = await fetch(
            `${API_URL}/api/search`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    year: parseInt(vehicle.year),
                    make: vehicle.make,
                    model: vehicle.model,
                    engine: vehicle.engine,
                    trim: vehicle.trim,
                    part: vehicle.part
                })
            }
        );

        const data = await res.json();

        setResults(data);
        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-gray-50">

            {/* HERO SECTION */}

            <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6">

                <div className="max-w-5xl mx-auto text-center">

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Find the Best Price on Auto Parts
                    </h1>

                    <p className="text-blue-100 text-lg mb-10">
                        Compare prices from multiple marketplaces and get the best deal for your vehicle
                    </p>

                    {/* Vehicle Search */}

                    <div className="bg-white rounded-xl shadow-xl p-6 text-black">

                        <div className="grid md:grid-cols-3 gap-3 mb-4">

                            <input
                                className="border p-3 rounded"
                                placeholder="Year"
                                value={vehicle.year}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, year: e.target.value })
                                }
                            />

                            <input
                                className="border p-3 rounded"
                                placeholder="Make"
                                value={vehicle.make}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, make: e.target.value })
                                }
                            />

                            <input
                                className="border p-3 rounded"
                                placeholder="Model"
                                value={vehicle.model}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, model: e.target.value })
                                }
                            />

                            <input
                                className="border p-3 rounded"
                                placeholder="Engine"
                                value={vehicle.engine}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, engine: e.target.value })
                                }
                            />

                            <input
                                className="border p-3 rounded"
                                placeholder="Trim"
                                value={vehicle.trim}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, trim: e.target.value })
                                }
                            />

                            <input
                                className="border p-3 rounded"
                                placeholder="Part (ex: brake pads)"
                                value={vehicle.part}
                                onChange={(e) =>
                                    setVehicle({ ...vehicle, part: e.target.value })
                                }
                            />

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


            {/* KEYWORD SEARCH */}

            <section className="max-w-4xl mx-auto px-6 mt-12">

                <div className="bg-white p-6 rounded-lg shadow mb-10">

                    <h2 className="font-semibold text-lg mb-3">
                        Search by Part Name
                    </h2>

                    <div className="flex gap-3">

                        <input
                            className="flex-1 border p-3 rounded"
                            placeholder="ex: brake pads"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <button
                            onClick={searchKeyword}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded"
                        >
                            Search
                        </button>

                    </div>

                </div>

            </section>


            {/* RESULTS */}

            <section className="max-w-6xl mx-auto px-6 pb-16">

                {loading && (
                    <p className="text-center text-gray-500 mb-6">
                        Searching for parts...
                    </p>
                )}

                {results.length > 0 && (() => {
                    const bestPrice = Math.min(...results.map(r => r.totalPrice));

                    return (
                        <div className="grid md:grid-cols-3 gap-6">

                            {results.map((item, i) => {

                                const isBest = item.totalPrice === bestPrice;

                                return (

                                    <div
                                        key={i}
                                        className={`bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-2xl 
                            ${isBest ? "ring-4 ring-green-500" : ""}`}
                                    >

                                        {/* Product Image */}
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="h-48 w-full object-cover"
                                            />
                                        )}

                                        <div className="p-6">

                                            {/* Store Badge */}
                                            <div className="mb-2">
                                                {item.source === "AMAZON" && (
                                                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                            AMAZON
                                        </span>
                                                )}

                                                {item.source === "EBAY" && (
                                                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            EBAY
                                        </span>
                                                )}
                                            </div>

                                            <h3 className="font-semibold text-lg mb-3">
                                                {item.title}
                                            </h3>

                                            <div className="text-2xl font-bold mb-3 text-green-600">
                                                ${item.totalPrice.toFixed(2)}
                                            </div>

                                            {isBest && (
                                                <div className="text-sm font-semibold text-green-700 mb-3">
                                                    Best Price
                                                </div>
                                            )}

                                            <a
                                                href={item.productUrl}
                                                target="_blank"
                                                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                                            >
                                                View Listing
                                            </a>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </section>
        </main>
    );
}