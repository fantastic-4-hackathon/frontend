import React, {useState, useEffect} from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage'; 

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
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App;
