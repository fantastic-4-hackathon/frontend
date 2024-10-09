const DEFAULT_TEMPERATURE = 0.7; // Hardcoded temperature

export const fetchSummary = async (prompt, apiKey, systemContent = null) => {
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
                    content: systemContent || "Summarize the following text into a concise WhatsApp marketing message with relevant emojis and NO hashtags, keeping the same tone:",
                },
                { role: 'user', content: prompt },
            ],
            temperature: DEFAULT_TEMPERATURE, // Use the hardcoded temperature
        }),
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
        
        if (!response.ok) {
            // Handle response errors (e.g., 4xx, 5xx)
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch summary');
        }
        
        const data = await response.json();
        
        // Check if choices is defined and has at least one item
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('No summary available. Please try again.');
        }
    } catch (error) {
        console.error('Error summarizing the text:', error);
        throw error; // Re-throw the error to handle it in the component
    }
};