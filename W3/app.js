require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const { allowedNodeEnvironmentFlags } = require("process");
const passport = require("passport");
const flash = require("connect-flash");

//const Game = require("./models/Game")

const app = express();
const PORT = process.env.PORT || 3000

//Passport Configuration
require("./config/passport")(passport);

// Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));

// Sets our static resources folder
app.use(express.static(path.join(__dirname,"public")));

// Middleware body-parser parses JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Setup Express-Session Middleware
app.use(session({
    secret:"secret",
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
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

// Required Route Router example
app.use("/", require("./routes/auth").router)
app.use("/", require("./routes/crud"))

// MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/gamelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check for connection
db.on("error", console.error.bind(console, "MongoDB Connection Error"))
db.once("open", ()=>{
    console.log("Connected to MongoDB")
})



// CRUD app examples Connection to database route examples below


//npm init makes package.json

//npm install express --save // install express server

// node app.js to start when in directory

// Defined routes listed here **********************

//Handlebars examples
app.get("/hbsindex", (req,res)=>{
    res.render("home", {
        title:"Welcome to the Handlbars Site",
        message:"This is our page using the template engine"
    })
});

app.get("/addgame", (req,res)=>{
    res.render("addgame", {
        title:"Add a game to the Favorite Game Database",
        message:"Please add a game."
    })
});

app.get("/json", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "players.json"))
})

app.get("/index", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/todo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "todo.json"))
})

app.get("/read-todo", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "read-todo.html"))
})





app.use((req, res) => {
    res.writeHead(301, {'Location': "http://" + req.headers['host'] + '/index' });
    res.end()
});

app.get("/nodemon",(req,res)=>{
    res.sendStatus(500);
})

// Listen to PORT
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})

module.exports = app;

// npm install passport-local connect-flash dotenv