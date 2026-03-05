"use client";

import { useState } from "react";

export default function ScanPage() {

    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState("");

    const handleUpload = async () => {

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/scan`,
            {
                method: "POST",
                body: formData,
            }
        );

        const text = await res.text();
        setResult(text);
    };

    return (
        <div>

            <h1>Scan Part Number</h1>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button onClick={handleUpload}>Scan</button>

            <p>Detected Text:</p>
            <pre>{result}</pre>

        </div>
    );
}