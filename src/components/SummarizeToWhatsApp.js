import React, { useState } from 'react';
import { fetchSummary } from '../API/fetchSummary'; // Adjust the import path as necessary

const SummarizeToWhatsApp = () => {
    const [prompt, setPrompt] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

        try {
            const summarizedMessage = await fetchSummary(prompt, apiKey);
            setSummary(summarizedMessage);
        } catch (error) {
            setSummary('Failed to summarize the text. Please try again.'); // Display a user-friendly error message
        }
    };

    return (
        <div>
            <h1>Summarize for WhatsApp</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your text here..."
                    rows="10"
                    cols="50"
                />
                <button type="submit">Summarize</button>
            </form>
            {summary && (
                <div>
                    <h2>Summarized Message:</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default SummarizeToWhatsApp;