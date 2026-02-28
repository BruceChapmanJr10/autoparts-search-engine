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

        try {

            const res = await fetch(
                `${API_URL}/api/search?query=${query}`
            );

            const data = await res.json();

            setResults(data);

        } catch (err) {
            console.error("Search failed", err);
        }

        setLoading(false);
    }

    async function searchVehicle() {

        if (!vehicle.part) return;

        setLoading(true);

        try {

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

        } catch (err) {
            console.error("Vehicle search failed", err);
        }

        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-gray-900 text-white py-10">

                <div className="max-w-6xl mx-auto px-6">

                    <h1 className="text-4xl font-bold">
                        Auto Parts Search Engine
                    </h1>

                    <p className="text-gray-300 mt-2">
                        Compare prices from eBay and Amazon
                    </p>

                </div>

            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Keyword Search */}

                <div className="bg-white p-6 rounded-lg shadow mb-8">

                    <h2 className="font-semibold mb-3">
                        Search by Part
                    </h2>

                    <div className="flex gap-3">

                        <input
                            className="flex-1 border rounded px-4 py-3"
                            placeholder="ex: brake pads"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <button
                            onClick={searchKeyword}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
                        >
                            Search
                        </button>

                    </div>

                </div>

                {/* Vehicle Search */}

                <div className="bg-white p-6 rounded-lg shadow mb-10">

                    <h2 className="font-semibold mb-4">
                        Search by Vehicle
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">

                        <input
                            className="border rounded p-2"
                            placeholder="Year"
                            value={vehicle.year}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, year: e.target.value })
                            }
                        />

                        <input
                            className="border rounded p-2"
                            placeholder="Make"
                            value={vehicle.make}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, make: e.target.value })
                            }
                        />

                        <input
                            className="border rounded p-2"
                            placeholder="Model"
                            value={vehicle.model}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, model: e.target.value })
                            }
                        />

                        <input
                            className="border rounded p-2"
                            placeholder="Engine"
                            value={vehicle.engine}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, engine: e.target.value })
                            }
                        />

                        <input
                            className="border rounded p-2"
                            placeholder="Trim"
                            value={vehicle.trim}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, trim: e.target.value })
                            }
                        />

                        <input
                            className="border rounded p-2"
                            placeholder="Part (ex: brake pads)"
                            value={vehicle.part}
                            onChange={(e) =>
                                setVehicle({ ...vehicle, part: e.target.value })
                            }
                        />

                    </div>

                    <button
                        onClick={searchVehicle}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                        Search Parts
                    </button>

                </div>

                {/* Loading */}

                {loading && (
                    <p className="text-center text-gray-600 mb-6">
                        Searching listings...
                    </p>
                )}

                {/* Results */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {results.map((item, i) => (

                        <div
                            key={i}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 flex flex-col"
                        >

                            {/* Image Placeholder */}

                            <div className="bg-gray-200 h-40 rounded mb-4 flex items-center justify-center text-gray-500">
                                Image
                            </div>

                            {/* Title */}

                            <h3 className="font-semibold text-lg mb-2">
                                {item.title}
                            </h3>

                            {/* Source Badge */}

                            <div className="mb-2">

                                <span className={`text-xs px-2 py-1 rounded font-semibold
                                    ${item.source === "EBAY"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-orange-200 text-orange-800"}
                                `}>
                                    {item.source}
                                </span>

                            </div>

                            {/* Price */}

                            <div className="text-2xl font-bold mb-4">
                                ${item.totalPrice.toFixed(2)}
                            </div>

                            {/* Button */}

                            <a
                                href={item.productUrl}
                                target="_blank"
                                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded"
                            >
                                View Listing
                            </a>

                        </div>

                    ))}

                </div>

            </div>

        </main>
    );
}