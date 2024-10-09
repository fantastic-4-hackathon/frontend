import React, { useState   } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchSummary} from '../API/fetchSummary'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Dummy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sumText, description} = location.state || {
        sumText: "No text provided",
        description: "No message provided",

    };
    
    const [summary, setSummary] = useState(sumText);
    const prompt = description;

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

            <p>{description}</p>

            <button onClick={handleFetchSummary}>Get Summary</button>
            {summary && <p>Summary: {summary}</p>}
            <ToastContainer />
        </div>
    );    
};

export default Dummy;