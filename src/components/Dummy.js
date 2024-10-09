import React, { useState   } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSummary} from '../API/fetchSummary'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Dummy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { text, message } = location.state || {
        text: "No text provided",
        message: "No message provided",

    };
    
    const [summary, setSummary] = useState('');
    const prompt = text;

    const handleFetchSummary = async () => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 
    
        try {
            const sumText = await fetchSummary(prompt, apiKey);
            setSummary(sumText);
            toast.success("Summary Generated");
            navigate('/whatsapp', {state: sumText});
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