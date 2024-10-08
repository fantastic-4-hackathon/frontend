import React, { useState } from 'react';
import './SummarizeToWhatsapp.css'

// This function simulates the summarize_to_whatsapp function from Python
const SummarizeToWhatsApp = () => {
    const [prompt, setPrompt] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: "Summarize the following text into a concise WhatsApp marketing message with relevant emojis and NO hashtags, keeping the same tone:",
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            }),
        };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
            const data = await response.json();
            const summarizedMessage = data.choices[0].message.content;
            setSummary(summarizedMessage);
        } catch (error) {
            console.error('Error summarizing the text:', error);
        }
    };

    return (
        <div className="summarize-container">
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