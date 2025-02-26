/*
const WebSocket = require("ws");

const server = new WebSocket.Server({port:8080});

server.on("connection", (socket) => {
    console.log("New user client connected");
    



    socket.on("message", (message) =>{
        console.log(`Received: ${message}`);
        socket.send(`Server received: ${message}`);
    })

    // gets called when user disconnects
    socket.on("close", () =>{
        console.log("User client disconnected");

    })
})

console.log("WebSocket Server is running on ws://localhost:8080");

*/