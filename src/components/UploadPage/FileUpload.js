import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaUndoAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { extractText } from '../../API/extractText';
import { fetchSummary } from '../../API/fetchSummary';
import { useNavigate, useLocation } from 'react-router-dom';
import './FileUpload.css';

const FileUpload = () => {
  const location = useLocation();
  const { name, surname, user_id } = location.state || {
    name: "No text provided",
    surname: "No message provided",
    user_id: "No user_id provided"
  };

  // State for the dropdown selections
  const [education, setEducation] = useState('');
  const [age, setAge] = useState('');
  const [persona, setPersona] = useState({});
  const [personas, setPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState("");
  const [isPersona, setIspersona] = useState(false);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle WhatsApp message-related state
  const [contacts, setContacts] = useState([]);
  const [messageContent, setMessageContent] = useState(description);
  const [messageStatus, setMessageStatus] = useState(null);
  const [sentNumbers, setSentNumbers] = useState([]);

  useEffect(() => {
    // Fetch personas when component mounts
    fetch("/persona/")
      .then(response => response.json())
      .then(data => setPersonas(data))
      .catch(error => console.error("Error fetching personas:", error));

    // Fetch contacts from the backend for WhatsApp messaging
    fetch('http://localhost:5000/contacts/')
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  useEffect(() => {
    if (selectedPersonaId) {
      console.log("Selected Persona ID:", selectedPersonaId);
  
      fetch(`/persona/${selectedPersonaId}`)  // Corrected variable name
        .then(response => response.json())
        .then(data => {
          setPersona(data);
        })
        .catch(error => console.error("Error fetching persona details:", error));

        console.log(persona)
        setIspersona(true)
    }
    
  }, [selectedPersonaId]);

  useEffect(() => {
    // Update isPersonaSelected based on whether the persona has valid data
    console.log('isPersona:',isPersona)
  }, [isPersona]);

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
        const systemContent =generatePersonaSentence(persona);
        try {
            const sumText = await fetchSummary(description , apiKey, systemContent);
            setMessageContent(sumText);
            toast.success("Summary Generated");
            // navigate('/whatsapp', {state: sumText});
        } catch (error) {
            toast.error(error.message || 'Failed to fetch summary. Please try again.');
            console.error(error);
        }
        
    } else{
        const systemContent =generateAgeEducationSentence(age, education);
        try {
            const sumText = await fetchSummary(description , apiKey, systemContent);
            setMessageContent(sumText);
            toast.success("Summary Generated");
            // navigate('/whatsapp', {state: sumText});
        } catch (error) {
            toast.error(error.message || 'Failed to fetch summary. Please try again.');
            console.error(error);
        }
    }
};

  const handleFileChange = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.msg'))) {
      setFile(selectedFile);
      setProgress(0);
      setIsFileUploaded(true);
      toast.success('File uploaded successfully!');

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 10;
          clearInterval(interval);
          return 100;
        });
      }, 300);
    } else {
      toast.error('Please upload a valid PDF or MSG file.');
    }
  };

  const handleExtractText = async () => {
    if (file) {
      try {
        const props = await extractText(file);
        if (props.message === "No text from file to be extracted") {
          toast.warning("No Text can be extracted. Try another file");
        } else {
          setDescription(props.text);
          setMessageContent(props.text);
        }
      } catch (error) {
        toast.error("Error extracting text");
      }
    }
  };

  const sendMessageToAll = () => {
    const accountSid = process.env.REACT_APP_ACCOUNT_SID;
    const authToken = process.env.REACT_APP_AUTH_TOKEN;
    const fromWhatsAppNumber = process.env.REACT_APP_FROM_WHATSAPP_NUMBER;

    const promises = contacts.map(contact => {
      const data = new URLSearchParams({
        From: fromWhatsAppNumber,
        To: `whatsapp:${contact.phone_number}`,
        Body: messageContent
      });

      return fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return contact.phone_number;
        });
    });

    Promise.allSettled(promises)
      .then(results => {
        const successfullySentNumbers = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        if (successfullySentNumbers.length > 0) {
          toast.success(`Messages sent to: ${successfullySentNumbers.join(', ')}`);
        } else {
          toast.warning('No messages were sent.');
        }
      })
      .catch(error => {
        toast.error(`Failed to send messages: ${error.message}`);
      });
  };

const [errorMessage, setErrorMessage] = useState('');
const [infoMessage, setInfoMessage] = useState('');

const handleSubmit = () => {
  if ((education && age) || selectedPersonaId) {
    setErrorMessage('');
    setInfoMessage('You can now upload your file.');
    // Proceed to the next step
  } else {
    setErrorMessage('Please select either Age and Education Level or a Persona to proceed.');
    setInfoMessage('');
  }
};

  return (
    <div className="file-upload-container">
      <h1>Marketing Content Generator</h1>
      <p>Use this tool to generate content by selecting the segment and either describing your issue or uploading a file.</p>

      <h2>Segment</h2>
      <div className="segment-dropdowns">
        <div className="dropdown">
          <label htmlFor="education" className={`floating-label ${education ? 'has-value' : ''}`}>
            Education Level
          </label>
          <select
            id="education"
            value={education}
            onChange={(e) => {
              setEducation(e.target.value);
              if (e.target.value) {
                setSelectedPersonaId(''); // Clear persona if education is selected
              }
            }}
          >
            <option value="" disabled></option>
            <option value="no-schooling">No Schooling</option>
            <option value="no-matric">No Matric</option>
            <option value="matric">Matric</option>
            <option value="technikon-diploma">Technikon/Diploma</option>
            <option value="university-degree">University Degree</option>
            <option value="postgraduate-degree">Postgraduate Degree</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="age" className={`floating-label ${age ? 'has-value' : ''}`}>
            Age
          </label>
          <select
            id="age"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              if (e.target.value) {
                setSelectedPersonaId(''); // Clear persona if age is selected
              }
            }}
          >
            <option value="" disabled></option>
            <option value="20-49">20-49</option>
            <option value="50+">50+</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="persona" className={`floating-label ${selectedPersonaId ? 'has-value' : ''}`}>
            Persona
          </label>
          <select
            id="persona"
            value={selectedPersonaId}
            onChange={(e) => {
              setSelectedPersonaId(e.target.value);
              if (e.target.value) {
                setEducation(''); // Clear education if persona is selected
                setAge(''); // Clear age if persona is selected
              }
            }}
            disabled={age || education ? true : false} // Disable if age or education is selected
          >
            <option value="" disabled></option>
            {personas.map((persona) => (
              <option key={persona.persona_id} value={persona.persona_id}>
                {persona.name}
              </option>
            ))}
          </select>
        </div>

        <FaUndoAlt className="reset-icon" title="Reset All" onClick={() => { setEducation(''); setAge(''); setSelectedPersonaId(''); setPersona({}); setIspersona(false); }} />
      </div>

      <div className="action-container">
        <button className="submit-button" onClick={handleSubmit}>
          Proceed to Upload
        </button>
        <div className="message-container">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {infoMessage && <p className="info-message">{infoMessage}</p>}
        </div>
      </div>

      <h2>Upload a file to extract text, edit text, and summarize content </h2>
      <div
        className={`file-upload-box ${isFileUploaded ? 'disabled' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          handleFileChange(droppedFile);
        }}
      >
        <input
          type="file"
          id="fileInput"
          onChange={(e) => handleFileChange(e.target.files[0])}
          disabled={isFileUploaded}
          ref={fileInputRef}
          accept=".pdf,.msg"
        />
        <label htmlFor="fileInput" className="file-upload-label">
          Drag & Drop files here or <span>Choose file</span>
        </label>
      </div>

      {file && (
        <div className="file-preview">
          <p>{file.name} ({(file.size / 1024).toFixed(2)}KB)</p>
          <progress value={progress} max="100"></progress>
          <div className="file-actions">
          <FaEdit
              className="file-action-icon edit-icon"
              onClick={() => {
                // Clear file input value
                fileInputRef.current.value = '';
                
                // Use setTimeout to ensure file input click is properly handled
                setTimeout(() => {
                  fileInputRef.current.click();
                }, 0);
              }}
              title="Edit File"
            />
            <FaTrashAlt className="file-action-icon remove-icon" onClick={() => setFile(null)} title="Remove File" />
          </div>
        </div>
      )}

      {(file && progress === 100) || (description.length >= 50) ? (
        <button onClick={handleExtractText} className="extract-button">
          Extract Text
        </button>
      ) : (
        <button disabled className="extract-button-disabled">
          Extract Text
        </button>
      )}

      {description && (
        <>
          <h2>Edit extracted text</h2>
          <textarea
            className="description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      )}

      {description.length >= 50 ? (
        <button onClick={handleFetchSummary} className="extract-button">
          Generate Text
        </button>
      ) : (
        <button disabled className="extract-button-disabled">
          Generate Text
        </button>
      )}

      {messageContent && (
        <div className="whatsapp-section">
          <h2>Send WhatsApp Message</h2>
          <textarea
            placeholder="Message Content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <button onClick={sendMessageToAll}>Send WhatsApp Message</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default FileUpload;