import React, {useState, useEffect} from 'react';
import './App.css';

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

      {data.mem.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}

export default App;
