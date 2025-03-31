const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const landingRoutes = require("./routes/landingRoutes")
const adminRoutes = require("./routes/adminRoutes")
const session = require("express-session")
const app = express();


// set view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

// sessions
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true, maxAge:600000}
}))


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', landingRoutes)
app.use('/admin', adminRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})