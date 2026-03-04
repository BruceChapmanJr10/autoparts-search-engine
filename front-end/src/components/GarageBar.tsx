"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GarageVehicle = {
    id: number;
    year: number;
    make: string;
    model: string;
    trim?: string;
    engine?: string;
};

export default function GarageBar({
                                      onSelectVehicle,
                                  }: {
    onSelectVehicle: (vehicle: GarageVehicle) => void;
}) {
    const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
    const [open, setOpen] = useState(false);

    const garageId =
        typeof window !== "undefined"
            ? localStorage.getItem("garageId") ??
            (() => {
                const id = crypto.randomUUID();
                localStorage.setItem("garageId", id);
                return id;
            })()
            : "";

    async function loadGarage() {
        const res = await fetch(`${API_URL}/api/garage/${garageId}`);
        const data = await res.json();
        setVehicles(data);
    }

    async function deleteVehicle(id: number) {
        await fetch(`${API_URL}/api/garage/${id}`, {
            method: "DELETE",
        });
        loadGarage();
    }

    useEffect(() => {
        loadGarage();
    }, []);

    return (
        <div className="bg-white border-b">

            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm font-semibold flex items-center gap-2"
                >
                    🚗 My Garage
                </button>

                <span className="text-xs text-gray-500">
          {vehicles.length} saved
        </span>

            </div>

            {open && (

                <div className="max-w-6xl mx-auto px-6 pb-4">

                    <div className="flex flex-wrap gap-3">

                        {vehicles.map((v) => (

                            <div
                                key={v.id}
                                className="border rounded-lg p-3 bg-gray-50 text-sm"
                            >
                                <div className="font-semibold">
                                    {v.year} {v.make} {v.model}
                                </div>

                                {(v.trim || v.engine) && (
                                    <div className="text-xs text-gray-500 mb-2">
                                        {v.trim} {v.engine}
                                    </div>
                                )}

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => {
                                            onSelectVehicle(v);
                                            setOpen(false);
                                        }}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        Use
                                    </button>

                                    <button
                                        onClick={() => deleteVehicle(v.id)}
                                        className="text-xs text-red-500"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                        {vehicles.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No vehicles saved yet
                            </p>
                        )}

                    </div>

                </div>

            )}

        </div>
    );
}