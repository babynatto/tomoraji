// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Fake credentials for the sake of this example
const validCredentials = {
  username: "streamer1",
  password: "password123"
};

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like login.html
app.use(session({
  secret: 'your-secret-key', // Use a secret string in production!
  resave: false,
  saveUninitialized: true,
}));

// Serve login page (GET request)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Serve login.html
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication check
  if (username === validCredentials.username && password === validCredentials.password) {
    req.session.loggedIn = true; // Create a session for the logged-in user
    res.redirect('/streamer');  // Redirect to the streamer page after successful login
  } else {
    res.send('<h2>Invalid username or password. Please try again.</h2>');
  }
});

// Serve streamer page after successful login (GET request)
app.get('/streamer', (req, res) => {
  if (req.session.loggedIn) {
    res.send('<h2>Welcome, Streamer! You are now logged in and ready to stream.</h2>');
  } else {
    res.redirect('/login'); // If not logged in, redirect to the login page
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});