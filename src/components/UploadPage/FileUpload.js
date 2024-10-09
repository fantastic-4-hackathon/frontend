import React, { useState, useRef } from 'react';
import { FaEdit, FaTrashAlt, FaUndoAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { extractText } from '../../API/extractText';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';

const FileUpload = () => {
  // State for the dropdown selections
  const [education, setEducation] = useState('');
  const [age, setAge] = useState('');
  const [persona, setPersona] = useState('');

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
          navigate('/dummy', { state: props });
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
    setPersona('');
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
  
  const handlePersonaChange = (e) => {
    setPersona(e.target.value);
    if (e.target.value) {
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
          <select
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
          </select>
        </div>

        {/* Reset button */}
        <FaUndoAlt className="reset-icon" title="Reset All" onClick={resetAllSelections} />
      </div>

      {/* Textarea for description */}
      <h2>Provide text or upload a file to summarize content </h2>
      <textarea
        className="description-textarea"
        placeholder="Describe your issue (3000 character limit)"
        maxLength={3000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

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
    </div>
  );
};

export default FileUpload;