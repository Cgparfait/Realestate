const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const landingRoutes = require("./routes/landingRoutes")

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


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
