// fetchSummary.js
const DEFAULT_TEMPERATURE = 0.7; // Hardcoded temperature

export const fetchSummary = async (prompt, apiKey) => {
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
            temperature: DEFAULT_TEMPERATURE, // Use the hardcoded temperature
        }),
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error summarizing the text:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};