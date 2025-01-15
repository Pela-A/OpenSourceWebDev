const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000

app.use(express.static(path.join(__dirname,"public")));

//npm init makes package.json

//npm install express --save // install express server

// node app.js to start when in directory

// Defined routes listed here
app.get("/json", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "players.json"))
})
app.get("/index", (req, res) =>{
    console.log("inside index")
    res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/todo", (req, res) => {
    console.log("got to json")
    res.sendFile(path.join(__dirname, "public", "todo.json"))
})
app.get("/read-todo", (req, res) => {
    console.log("got here")
    res.sendFile(path.join(__dirname, "public", "read-todo.html"))
})

app.use((req, res) => {
    res.writeHead(301, {'Location': "http://" + req.headers['host'] + '/index' });
    res.end()
});
// Listen to PORT
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})



