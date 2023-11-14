import React from 'react';
import axios from 'axios';

function App() {
  const uploadFile = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData);
      console.log(response.data);
      alert('File uploaded and converted successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Hello</h1>
      <input type="file" id="fileInput" />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  );
}

export default App;

