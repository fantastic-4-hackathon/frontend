import React, { useState } from 'react';

const Avatar = ({name, surname}) => {


  // The base URL for the UI Avatars API
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name + ' ' + surname)}&background=0075c9&color=fff`;

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={avatarUrl} alt="avatar" style={{ marginTop: '10px', borderRadius: '50%', width: '40px', height: '40px' }} />
    </div>
  );
};

export default Avatar;