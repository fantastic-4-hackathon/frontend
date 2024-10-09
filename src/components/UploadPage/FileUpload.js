import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { extractText } from '../../API/extractText';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const navigate = useNavigate();

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
          if (props.message === "No text from file to be extracted"){
            toast.warning("No Text can be extracted. Try another file");
            //TODO: Remove the file 
          }else{
            navigate('/dummy', {state: props});
          }
      } catch (error) {
          toast.error("Error extracting Text");
      }
    }
  };

  return (
    <div className="file-upload-container">
      <ToastContainer position="top-right" autoClose={3000} />

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
        </div>
      )}

      {file && progress === 100 && (
        <button className="extract-text-button" onClick={handleExtractText}>
          Extract text
        </button>
      )}
    </div>
  );
};

export default FileUpload;