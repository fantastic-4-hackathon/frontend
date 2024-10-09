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
    const isPersona = false;
    const age =  '50+';
    const education = 'No Schooling';


    const data ={
        "age": {
            "age_range_id": 2,
            "age_range_name": "50+",
            "description": "Older Adult"
        },
        "education": {
            "education_id": 5,
            "level": "University Degree"
        },
        "persona": {
            "age_range_id": 2,
            "communication_style_id": 1,
            "education_id": 5,
            "gender": "Male",
            "long_term_goal": "Financial freedom",
            "name": "Nick",
            "persona_id": 1,
            "short_term_goal": "Respect",
            "thinking_style": "Intuitive"
        }
    }
    
    const [summary, setSummary] = useState(sumText);
    const prompt = description;

    const handleFetchSummary = async () => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 
        const generatePersonaSentence = (data) => {
            const age = data.age;
            const education = data.education;
            const persona = data.persona;
        
            const sentence = `This is a person who is ${persona.gender}, ${age.age_range_name} (${age.description}), and has a education of  ${education.level}. ` +
                             `Their long-term goal is to achieve '${persona.long_term_goal}' and their short-term goal is '${persona.short_term_goal}'. ` +
                             `They have an ${persona.thinking_style} thinking style. ` +
                             `Make sure to take these attributes and qualities into consideration when generating the whatsapp message and what emojis to use.` 
                             + `Summarize the following text into a concise WhatsApp marketing message with relevant emojis, NO HASHTAGS:`;
        
            return sentence;
        };
        const generateAgeEducationSentence = (Age, Education) => {
        
            const sentence = `This is a person who is ${Age} old, and with an education level of  ${Education}. ` +
                             `Make sure to take these attributes and qualities into consideration when generating the whatsapp message and what emojis to use.` 
                             + `Summarize the following text into a concise WhatsApp marketing message with relevant emojis, NO HASHTAGS:`;
        
            return sentence;
        };

        if (isPersona){
            const systemContent =generatePersonaSentence(data);
            try {
                const sumText = await fetchSummary(prompt , apiKey, systemContent);
                setSummary(sumText);
                toast.success("Summary Generated");
                navigate('/whatsapp', {state: sumText});
            } catch (error) {
                toast.error(error.message || 'Failed to fetch summary. Please try again.');
                console.error(error);
            }
            
        } else{
            const systemContent =generateAgeEducationSentence(age, education);
            try {
                const sumText = await fetchSummary(prompt , apiKey, systemContent);
                setSummary(sumText);
                toast.success("Summary Generated");
                navigate('/whatsapp', {state: sumText});
            } catch (error) {
                toast.error(error.message || 'Failed to fetch summary. Please try again.');
                console.error(error);
            }
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