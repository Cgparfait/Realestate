const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const landingRoutes = require("./routes/landingRoutes")
const adminRoutes = require("./routes/adminRoutes")
const session = require("express-session")
const app = express();
const nunjucks = require('nunjucks');


// set view engine
// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Configure Nunjucks
nunjucks.configure(app.get('views'), {
    autoescape: true,
    express: app,
    watch: true, // Auto-reload templates in development
    noCache: process.env.NODE_ENV !== 'production' // Disable cache in dev
});

app.set('view engine', 'njk');
app.use(express.static(path.join(__dirname, "public")));
// app.set("views", path.join(__dirname, "views"));

// sessions
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    })
}))


// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', landingRoutes)
app.use('/admin', adminRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})