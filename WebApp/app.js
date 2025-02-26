require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Setup static folder
app.use(express.static("public"));

// OpenAI API Setup
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

const users = new Set();

// io connection created. Define various actions below
io.on("connection", (socket) => {
    console.log("A new user connected to the server.");

    socket.on("chat message", async (msg) => {
        console.log(`Message from ${socket.username || socket.id}: ${msg}`);

        // Broadcast user message to all connected clients
        io.emit("chat message", { text: `${socket.username || "User"}: ${msg}`, fromBot: false });


         // Check if the message starts with "@bot "
        if (msg.startsWith("@bot ")) {
            const userMessage = msg.replace("@bot ", ""); // Remove "@bot " from the message

            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: userMessage }],
                });

                const botResponse = completion.choices[0].message.content;
                io.emit("chat message", { text: "ChatGPT: " + botResponse, fromBot: true });
            } catch (error) {
                console.error("Error with OpenAI API:", error);
                io.emit("chat message", {text:"ChatGPT: I'm experiencing issues. Please try again later.", fromBot: true});
            }
        }
    });

    // Set username and emit to user list
    socket.on("set username", (username) => {
        socket.username = username;
        users.add(username);
        io.emit("user list", Array.from(users));
    });

    // Remove user from list and emit to user list
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.username);
        users.delete(socket.username);
        io.emit("user list", Array.from(users));
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
