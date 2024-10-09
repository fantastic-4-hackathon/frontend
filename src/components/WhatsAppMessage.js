import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const WhatsAppMessage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sumText  = location.state || "No text provided";


  const [contacts, setContacts] = useState([]); // Store contacts from the backend
  const [messageContent, setMessageContent] = useState(sumText);
  const [messageStatus, setMessageStatus] = useState(null);
  const [sentNumbers, setSentNumbers] = useState([]); // Store sent numbers

  useEffect(() => {
    // Fetch contacts from the backend
    fetch('http://localhost:5000/contacts/')  // Updated URL to include backend port
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setContacts(data);  // Set fetched contacts
      })
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  const sendMessageToAll = () => {
    const accountSid = process.env.REACT_APP_ACCOUNT_SID; // Twilio Account SID
    const authToken = process.env.REACT_APP_AUTH_TOKEN;   // Twilio Auth Token
    const fromWhatsAppNumber = process.env.REACT_APP_FROM_WHATSAPP_NUMBER;      // Twilio WhatsApp Number

    const promises = contacts.map(contact => {
      const data = new URLSearchParams({
        From: fromWhatsAppNumber,
        To: `whatsapp:${contact.phone_number}`, // Recipient's WhatsApp Number
        Body: messageContent // Message Content
      });

      return fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`, // Base64 encode account credentials
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString(),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return contact.phone_number; // Return the phone number of the successfully sent message
      });
    });

    Promise.allSettled(promises) // Use Promise.allSettled to handle all promises
      .then(results => {
        const successfullySentNumbers = results
          .filter(result => result.status === 'fulfilled') // Filter successful messages
          .map(result => result.value);
          
        setSentNumbers(successfullySentNumbers); // Store sent numbers
        setMessageStatus(`Messages sent to: ${successfullySentNumbers.join(', ')}`);
        console.log('Messages sent to:', successfullySentNumbers);
      })
      .catch(error => {
        setMessageStatus(`Failed to send messages: ${error.message}`);
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Send WhatsApp Message</h1>
      <textarea
        placeholder="Message Content"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button onClick={sendMessageToAll}>Send WhatsApp Message to All</button>

      {messageStatus && <p>{messageStatus}</p>}
      {sentNumbers.length > 0 && (
        <div>
          <h2>Messages sent to:</h2>
          <ul>
            {sentNumbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WhatsAppMessage;