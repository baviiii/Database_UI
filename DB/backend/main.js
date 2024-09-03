// Setup local environment variables
require('dotenv').config()

// Import relevant dependencies
const express = require('express');               // Application server
const mongoose = require('mongoose');             // Connects and controls our mongodb database
const cors = require('cors');                     // Cross-origin settings
const fileUpload = require('express-fileupload'); // Upload files from the client

const PORT = process.env.PORT | 8000;              // Current port, either use .env PORT or 8000,
const mongo_uri = process.env.MONGODB_URI;         // Setup uri to our mongodb database
const BASE_API = "/api";                           // constant api prefix to all our APIs.

mongoose.connect(mongo_uri);                       // Connect to remote mongodb database

// noinspection JSUnresolvedVariable
const db = mongoose.connection;                    // Create our database connection instance
const app = express();                             // Create our server application instance

app.use(cors());                                   // pass cors settings to the server

app.use(fileUpload({                     // File upload settings. Any file types.
  limits: {
    fileSize: 50 * 1024 * 1024                     // Set maximum file size. 50MB
  },
}));

db.on('error', (error) => console.log(error))      // Handle any errors that may arise during connection

db.once('connected',                               // Handle what happens after first successful connection
    () => console.log("DB Connected"));

app.use(express.json());                           // Set express to use json responses,

// Add routes to express server
// app.use([Prefix to that api], [api module])
app.use(`${BASE_API}/membership`, require('./routes/membership'));
app.use(`${BASE_API}/health`, require('./routes/health'));
app.use(`${BASE_API}/finance`, require('./routes/financials'));


app.listen(PORT, () => {                // Event loop, listen to all requests made to the server (host:port)
  console.log(`Port: ${PORT}`)
});

