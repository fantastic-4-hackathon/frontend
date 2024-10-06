import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {

  const [data, setData] = useState({});


  useEffect(() => {
    fetch("/mem").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    <div>
      <h1>Hello World</h1>
      <div className="App">
        <h1>File Upload</h1>
        <FileUpload />
      </div>
    </div>
  );
}

export default App;
