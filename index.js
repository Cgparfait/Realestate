const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const landingRoutes = require("./routes/landingRoutes")
const adminRoutes = require("./routes/adminRoutes")
const fs = require('fs')

const app = express();


// set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', landingRoutes)
app.use('/admin', adminRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})


function logFilesInBaseDirectory(dirPath) {
    // Read all files and directories in the given directory
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Loop through each item in the directory
        files.forEach((file) => {
            // Create the full path for the item
            const filePath = path.join(dirPath, file);

            // Get stats for the current item
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                console.log(`File: ${filePath}`);
            });
        });
    });
}

// Start by logging files in the base directory (current directory)
logFilesInBaseDirectory(__dirname);