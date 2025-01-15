const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000

app.use(express.static(path.join(__dirname,"public")));

//npm init makes package.json

//npm install express --save // install express server

// node app.js to start when in directory
let message = "Wouldn't you like to be a pepper too??";

function tellTheMessage(){
    console.log(message);
}
//tellTheMessage();

// Defined routes listed here
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
    console.log("got here")
    res.sendFile(path.join(__dirname, "public", "read-todo.html"))
})
// Redirect all unknown routes to the index page
// Could not figure out how to use your code sorry!
app.use((req, res) => {
    console.log("oof")
    res.redirect(301, "/index");
});

// Listen to PORT
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})

// localhost:3000/

// Creates listener on port 3000
/* Send the HTTP header
* HTTP Status: 301 : Moved Permanently
* Location:'http://' +  'The host of the requested location' + the path to the page that you want to be redirected to.
*/
// response.writeHead(301, {'Location': "http://" + request.headers['host'] + '/index.html' });


