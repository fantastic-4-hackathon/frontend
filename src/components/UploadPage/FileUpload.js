import React, { useState, useRef } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
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
        
//            if (description.length >= 50) {
//               console.log('Extracting text from description');
//               toast.info(`Extracting text from description`);
//            }
          if (props.message === "No text from file to be extracted"){
            toast.warning("No Text can be extracted. Try another file");
            //TODO: Remove the file 
          }else{
            navigate('/dummy', {state: props});
          }
      } catch (error) {
          toast.error("Error extracting Text");
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

  return (
    <div className="file-upload-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Page title and description */}
      <h1>Marketing Content Generator</h1>
      <p>Use this tool to generate content by selecting the segment and either describing your issue or uploading a file.</p>

      {/* Segment dropdowns */}
      <h2>Segment</h2>
      <div className="segment-dropdowns">
        <div className="dropdown">
          <select id="education" value={education} onChange={(e) => setEducation(e.target.value)}>
            <option value="" disabled>Select Education Level</option>
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
          <select id="age" value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="" disabled>Select Age</option>
            <option value="20-49">20-49</option>
            <option value="50+">50+</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="dropdown">
          <select id="persona" value={persona} onChange={(e) => setPersona(e.target.value)}>
            <option value="" disabled>Select Persona</option>
            <option value="nick">Nick</option>
            <option value="sandra">Sandra</option>
            <option value="refilwe">Refilwe</option>
            <option value="thabiso">Thabiso</option>
          </select>
        </div>
      </div>

      {/* Textarea for description */}
      <h2>Describe your issue or upload text/file</h2>
      <textarea
        className="description-textarea"
        placeholder="Describe your issue (3000 character limit)"
        maxLength={3000}
        value={description} // bind the value to state
        onChange={(e) => setDescription(e.target.value)} // update state on change
      ></textarea>

      {/* File upload component */}
      <div
        className={`file-upload-box ${isFileUploaded ? 'disabled' : ''}`}
        onDragOver={handleDragOver} // Enable drag over
        onDrop={handleDrop} // Handle drop event
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

      {/* Show Extract Text button if file is uploaded or description is at least 50 characters */}
      {(file && progress === 100) || (description.length >= 50) ? (
        <button className="extract-text-button" onClick={handleExtractText}>
          Extract text
        </button>
      ) : null}
    </div>
  );
};

export default FileUpload;