require("dotenv").config();
const express = require("express");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const {notFound, errorHandler} = require("./middlewares/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/user",userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

app.use("/api/admin", adminRoutes);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "../frontend/chat_app/dist")));

    app.get("*", (req, res) => {
        res.sendFile(
            path.join(__dirname1, "../frontend/chat_app/dist/index.html")
        );
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is Running Successfully");
    });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors: {
    origin: process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
},
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: "+ room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISSCONNECTED");
        socket.leave(userData._id);
    });
}
    );