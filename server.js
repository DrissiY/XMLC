const express = require('express');
const multer = require('multer');
const path = require('path');
const iconv = require('iconv-lite');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    callback(null, fileName);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API route for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file provided');
    }

    const uploadedFilePath = req.file.path;

    // Read the uploaded file with ISO encoding
    const xmlBuffer = fs.readFileSync(uploadedFilePath);
    const isoEncodedXml = iconv.decode(xmlBuffer, 'ISO-8859-1');

    // Convert to UTF-8
    const utf8EncodedXml = iconv.encode(isoEncodedXml, 'UTF-8');

    // Write the converted XML back to the file
    fs.writeFileSync(uploadedFilePath, utf8EncodedXml);

    res.json({ message: 'File uploaded and converted successfully!' });
  } catch (error) {
    console.error('Error during file upload and conversion:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Display "Hello" on the main route
app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading uploads folder');
    }
    res.json({ files });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
