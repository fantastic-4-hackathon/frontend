import React, { useState   } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSummary} from '../API/fetchSummary'
import { ToastContainer, toast } from 'react-toastify';

const Dummy = () => {
    const location = useLocation();
    const { text, message } = location.state || {
        text: "No text provided",
        message: "No message provided",

    };
    
    const [summary, setSummary] = useState('');
    const prompt = text;

    const handleFetchSummary = async () => {
        const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    
        try {
            const result = await fetchSummary(prompt, apiKey);
            setSummary(result);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch summary. Please try again.');
            console.error(error);
        }
    };
    

    return (
        <div>
            <h1>Dummy</h1>

            <p>{text}</p>

            <button onClick={handleFetchSummary}>Get Summary</button>
            {summary && <p>Summary: {summary}</p>}
            <ToastContainer />
        </div>
    );    
};

export default Dummy;