const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchParts(query: string) {

    const res = await fetch(`${API_URL}/api/search?query=${query}`);

    if (!res.ok) {
        throw new Error("Failed to fetch search results");
    }

    return res.json();
}
