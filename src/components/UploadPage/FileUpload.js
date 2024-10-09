import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaUndoAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { extractText } from '../../API/extractText';
import { fetchSummary} from '../../API/fetchSummary';
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

  // Storing the segment selection values
  useEffect(() => {
    if (age) {
      console.log('Age:', age);
    }
  }, [age]);
  
  useEffect(() => {
    if (education) {
      console.log('Education:', education);
    }
  }, [education]);
  
  useEffect(() => {
    if (persona) {
      console.log('Persona:', persona);
    }
  }, [persona]);  

  useEffect(() => {
    if (!age && !education && !persona) {
      console.clear(); // This will clear the console
      console.log('Selections have been reset.');
    }
  }, [age, education, persona]);

  // Fetch all personas when the component mounts
  useEffect(() => {
    fetch("/persona/")
      .then(response => response.json())
      .then(data => setPersonas(data))
      .catch(error => console.error("Error fetching personas:", error));
  }, []);

  
  // State for file upload
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // State for the textarea input
  const [description, setDescription] = useState('');

  // Reference to the file input for editing the file
  const fileInputRef = useRef(null);

  // Toast notifications
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.msg'))) {
      setFile(selectedFile);
      setProgress(0);
      setIsFileUploaded(true);
      notifySuccess('File uploaded successfully!');

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) return prev + 10;
          clearInterval(interval);
          return 100;
        });
      }, 300);
    } else {
      notifyError('Please upload a valid PDF or MSG file.');
    }
  };

  // Handle generate whatsapp message
  const handleFetchSummary = async () => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY; 

    try {
        const sumText = await fetchSummary(description, apiKey);
        // setSummary(sumText);
        toast.success("Summary Generated");
        navigate('/dummy', {state: {sumText, description,age,education}});
    } catch (error) {
        toast.error(error.message || 'Failed to fetch summary. Please try again.');
        console.error(error);
    }
};

  // Handle the file input change event
  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };

  // Handle drag over event to prevent default behavior
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent the default behavior of file opening
  };

  // Handle file drop event
  const handleDrop = (e) => {
    e.preventDefault(); // Prevent file from being opened

    // Check if only one file is dropped
    if (e.dataTransfer.files.length > 1) {
      notifyError('Please upload only one file at a time.');
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleExtractText = async () => {
    if (file) {
      console.log('Extracting text from:', file.name);
      toast.info(`Extracting text from ${file.name}`);
      
      try {
        const props = await extractText(file);
        console.log(props.message);
        
        if (props.message === "No text from file to be extracted") {
          toast.warning("No Text can be extracted. Try another file");
        } else {
          setDescription(props.text)
          // navigate('/dummy', { state: props });
        }
      } catch (error) {
        toast.error("Error extracting Text");
      }
    }
  }

  // Handle file edit (trigger file input dialog)
  const handleEditFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.disabled = false; // Ensure it's enabled
      fileInputRef.current.click(); // Programmatically open file dialog
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    console.log('Remove icon clicked');
    setFile(null);
    setProgress(0);
    setIsFileUploaded(false);
    fileInputRef.current.value = ''; // Reset the file input
  };

  // Disable state
  const [isPersonaDisabled, setIsPersonaDisabled] = useState(false);
  const [isAgeEducationDisabled, setIsAgeEducationDisabled] = useState(false);

  // Handle Reset Function to clear selections
  const resetAllSelections = () => {
    setEducation('');
    setAge('');
    setPersona({});
    setSelectedPersonaId()
    setIsPersonaDisabled(false);
    setIsAgeEducationDisabled(false);
  };
  
  // Handle selection logic
  const handleEducationChange = (e) => {
    setEducation(e.target.value);
    if (e.target.value || age) {
      setIsPersonaDisabled(true);
    } else {
      setIsPersonaDisabled(false);
    }
  };
  
  const handleAgeChange = (e) => {
    setAge(e.target.value);
    if (e.target.value || education) {
      setIsPersonaDisabled(true);
    } else {
      setIsPersonaDisabled(false);
    }
  };
  
  const handlePersonaChange = (id) => {
    setSelectedPersonaId(id)
    fetch(`/persona/${id}`)
      .then(response => response.json())
      .then(data => {
        setPersona(data);
      })
      .catch(error => console.error("Error fetching persona details:", error));
 
    if (id) {
      setIsAgeEducationDisabled(true);
    } else {
      setIsAgeEducationDisabled(false);
    }
  };

  return (
    <div className="file-upload-container">
      {/* Page title and description */}
      <h1>Marketing Content Generator</h1>
      <p>Use this tool to generate content by selecting the segment and either describing your issue or uploading a file.</p>

      {/* Segment dropdowns */}
      <h2>Segment</h2>
      <p>You need to select either Age + Education Level or Persona.</p>
      
      <div className="segment-dropdowns">
        {/* Education Dropdown */}
        <div className="dropdown">
          <label htmlFor="education" className={`floating-label ${education ? 'has-value' : ''}`}>
            Education Level
          </label>
          <select
            id="education"
            value={education}
            onChange={handleEducationChange}
            disabled={isAgeEducationDisabled}
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

        {/* Age Dropdown */}
        <div className="dropdown">
          <label htmlFor="age" className={`floating-label ${age ? 'has-value' : ''}`}>
            Age
          </label>
          <select
            id="age"
            value={age}
            onChange={handleAgeChange}
            disabled={isAgeEducationDisabled}
          >
            <option value="" disabled></option>
            <option value="20-49">20-49</option>
            <option value="50+">50+</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Persona Dropdown */}
        <div className="dropdown">
          <label htmlFor="persona" className={`floating-label ${persona ? 'has-value' : ''}`}>
            Persona
          </label>
          {/* <select
            id="persona"
            value={persona}
            onChange={handlePersonaChange}
            disabled={isPersonaDisabled}
          >
            <option value="" disabled></option>
            <option value="nick">Nick</option>
            <option value="sandra">Sandra</option>
            <option value="refilwe">Refilwe</option>
            <option value="thabiso">Thabiso</option>
          </select> */}

          <select onChange={(e) => handlePersonaChange(e.target.value)} value={selectedPersonaId}>
          <option value="" disabled>Select Persona</option>
          {personas.map((persona) => (
            <option key={persona.persona_id} value={persona.persona_id}>
              {persona.name}
            </option>
          ))}
        </select>
        </div>

        {/* Reset button */}
        <FaUndoAlt className="reset-icon" title="Reset All" onClick={resetAllSelections} />
      </div>

      <h2>Upload a file to extract text, edit text and summarize content </h2>
      {/* File upload component */}
      <div
        className={`file-upload-box ${isFileUploaded ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleInputChange}
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
            <FaEdit className="file-action-icon edit-icon" onClick={handleEditFile} title="Edit File" />
            <FaTrashAlt className="file-action-icon remove-icon" onClick={handleRemoveFile} title="Remove File" />
          </div>
        </div>
      )}
      <br></br>

      {/* Textarea for description */}
      <textarea
        className="description-textarea"
        placeholder="Extracted text to review and edit prior to summary will be here..."
        maxLength={3000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <br></br>
      {/* Show Extract Text button if file is uploaded or description is at least 50 characters */}
      {(file && progress === 100) || (description && description.length >= 50) ? (
        <button onClick={handleExtractText} className="extract-button">
          Extract Text
        </button>
      ) : (
        <button disabled className="extract-button disabled">
          Extract Text
        </button>
      )}
      <br></br>
      <button onClick={handleFetchSummary} className="extract-button">
          Generate Text
        </button>
        <ToastContainer />
    </div>
  );
};

export default FileUpload;