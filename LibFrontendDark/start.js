const express = require('express');
const { exec } = require('child_process');
const app = express();

// Serve the start.html file
app.use(express.static(__dirname));
app.get('/start', (req, res) => {
    res.sendFile(__dirname + '/start.html');
});

// Start the server and open the browser
const port = 3000; // Set your desired port
const server = app.listen(port, () => {
    console.log(`Client server listening on port ${port}`);
    exec(`start http://localhost:${port}/start`);
});