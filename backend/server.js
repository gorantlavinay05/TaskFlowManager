const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI is not defined. Database features will not work.');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const frontendPath = path.join(__dirname, '../frontend/dist');
  
  // Debug: List contents of the expected directory
  try {
    const parentDir = path.join(__dirname, '..');
    console.log('Parent directory contents:', fs.readdirSync(parentDir));
    const frontendDir = path.join(parentDir, 'frontend');
    console.log('Frontend directory contents:', fs.readdirSync(frontendDir));
    if (fs.existsSync(frontendPath)) {
      console.log('Dist directory contents:', fs.readdirSync(frontendPath));
    } else {
      console.warn('DIST DIRECTORY DOES NOT EXIST at:', frontendPath);
    }
  } catch (err) {
    console.error('Error listing directories:', err);
  }
  
  console.log('Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));

  // Catch-all route to serve index.html for any non-API route
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Frontend build not found or Error occurred.');
      }
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger nodemon restart
