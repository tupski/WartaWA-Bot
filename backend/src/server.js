require('dotenv').config();
const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 8005;
const MAX_PORT_ATTEMPTS = 10; // Try up to 10 ports before giving up

// Function to try starting the server on a given port
function startServer(port, attempt = 1) {
  const server = http.createServer(app);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
      if (attempt < MAX_PORT_ATTEMPTS) {
        startServer(port + 1, attempt + 1);
      } else {
        console.error(`Could not find an available port after ${MAX_PORT_ATTEMPTS} attempts.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Start the server
startServer(PORT);