// src/app/page.tsx
'use client'; // This directive is crucial for client-side state and effects

import { useState, useEffect } from 'react';
import { CatFact } from '../types/catFact.d'; // Import our defined type

export default function CatFactsApp(): JSX.Element {
    const [fact, setFact] = useState<string | null>(null); // State to store the fetched fact
    const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
    const [error, setError] = useState<string | null>(null); // State for error messages

    // Function to fetch a new cat fact
    const fetchCatFact = async (): Promise<void> => {
        setLoading(true); // Set loading to true before fetching
        setError(null);   // Clear any previous errors
        setFact(null);    // Clear previous fact immediately for better UX

        try {
            const response = await fetch('https://catfact.ninja/fact');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CatFact = await response.json(); // Type the incoming data
            setFact(data.fact); // Update the fact state with the fact string
        } catch (err: any) { // Catch block for network or parsing errors
            console.error("Failed to fetch cat fact:", err);
            setError(`Failed to load fact: ${err.message || 'Unknown error'}.`);
        } finally {
            setLoading(false); // Set loading to false after fetch completes (success or error)
        }
    };

    // useEffect to fetch a fact automatically when the component mounts
    useEffect(() => {
        fetchCatFact();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Random Cat Fact</h1>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                {loading && (
                    <p className="text-lg text-gray-600 dark:text-gray-400">Loading a new fact...</p>
                )}

                {error && (
                    <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
                )}

                {fact && !loading && (
                    <p className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                        "{fact}"
                    </p>
                )}

                <button
                    onClick={fetchCatFact}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                    disabled={loading} // Disable button while loading
                    aria-label={loading ? "Loading fact..." : "Get another cat fact"}
                >
                    {loading ? 'Fetching...' : 'Get New Fact'}
                </button>
            </div>
        </div>
    );
}