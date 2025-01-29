const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const { allowedNodeEnvironmentFlags } = require("process");

const app = express();
const PORT = 3000

// Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");
app.set("views", "./views");

// Sets our static resources folder
app.use(express.static(path.join(__dirname,"public")));

// Middleware body-parser parses JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/gamelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check for connection
db.on("error", console.error.bind(console, "MongoDB Connection Error"))
db.once("open", ()=>{
    console.log("Connected to MongoDB")
})

// Mongoose Schema and Model
const gameSchema = new mongoose.Schema({
    gamename:String,
    developer:String
})

const Game = mongoose.model("Game", gameSchema, "favoritegames");

// CRUD app examples Connection to database route examples below

// GET route to get all data from database
app.get("/games", async (req,res) => {
    try{
        const games = await Game.find();
        res.json(games)
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch game data"})
    }
})

// GET route to get a single entry from database
app.get("/games/:id", async (req,res)=>{
    try{
        const game = await Game.findById(req.params.id)
        if(!game){
            return res.status(404).json({error:"Game not found"})
        }
        res.json(game)
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch game data"})
    }
})

// POST route
app.post("/addgame", async (req,res)=>{
    try{
        const newGame = new Game(req.body)
        const savedGame = await newGame.save()
        res.status(201).json(savedGame)
    }
    catch(err){
        res.status(500).json({error: "Failed to post game data"})
    }
})

// PUT route
app.put("/updategame/:id", (req,res)=>{
    Game.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedgame)=>{
        if(!updatedgame){
            return res.status(404).json({error:"Game not found"})   
        }
        res.json(updatedgame)
    }).catch((err)=>{
        return res.status(400).json({error:"Failed to update game"})   
    })
})

// DELETE route
app.get("/deletegame", async (req,res)=>{
    try{
        const gamename = req.query
        const game = await Game.find(gamename)

        if(game.length === 0){
            return res.status(404).json({error: "Failed to find the game"})
        }
        
        const deletedGame = await Game.findOneAndDelete(gamename)
        res.json({message:"Game deleted successfully"})
    }
    catch(err){
        console.error(err);
        res.status(404).json({error: "Game not found"})
    }
})

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



