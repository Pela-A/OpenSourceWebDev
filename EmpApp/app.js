require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");

const app = express();
const PORT =  process.env.PORT || 3000;

// Had to add method override to perform delete as requested. Otherwise had to use an async function inside the viewemployee handlebars file
const methodOverride = require('method-override');
const { isAuthenticated } = require("./routes/auth");
app.use(methodOverride('_method'));

//Passport Configuration
require("./config/passport")(passport);

// Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Sets our static resources folder
app.use(express.static(path.join(__dirname,"public")));

// Middleware body-parser parses JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Setup Express-Session Middleware
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

//Setup Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Setup Flash Messaging
app.use(flash())

// Global variables for Flash messages
app.use((req,res,next)=>{
    // 
    res.locals.user = req.isAuthenticated() ? req.user : null;
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

// Required Route Router example
app.use("/", require("./routes/auth").router)
app.use("/", require("./routes/crud"))

// MongoDB Database connection
const mongoURI = process.env.MONGO_URI; //||  "mongodb://localhost:27017/gamelibrary"
console.log(mongoURI)
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check for connection
db.on("error", console.error.bind(console, "MongoDB Connection Error"))
db.once("open", ()=>{
    console.log("Connected to MongoDB")
})

app.use((req, res) => {
    const destination = res.locals.user ? "/dashboard" : "/login";
    res.writeHead(301, { 'Location': "https://" + req.headers['host'] + destination });
    res.end();
});


app.get("/nodemon",(req,res)=>{
    res.sendStatus(500);
})

//Creates Listener on port 3000
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}.`);
})

module.exports = app;