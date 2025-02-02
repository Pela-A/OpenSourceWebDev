const express = require("express")
const router = express.Router()
const Game = require("../models/Game")
const {isAuthenticated} = require("./auth"); // Import our authentication routes

// GET route to get all data from database
router.get("/games", async (req,res) => {
    try{
        const games = await Game.find();
        res.json(games)
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch game data"})
    }
})

// GET route to get a single entry from database
router.get("/games/:id", async (req,res)=>{
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
router.post("/addgame", async (req,res)=>{
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
router.put("/updategame/:id", (req,res)=>{
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
router.get("/deletegame", async (req,res)=>{
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


router.get("/addgame", isAuthenticated, (req,res)=>{
    res.render("addgame", {
        title: "Add a game to the Favorite Game Database",
        message:"Please add a game."
    })
})







module.exports = router