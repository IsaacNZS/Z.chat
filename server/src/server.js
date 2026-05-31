const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();
const userrouter = require("./routers/userRouters");
const mesrouter = require("./routers/messageRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./Schemas/messageSchemas");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
mongoose.connect(process.env.DB_URL);
const server = http.createServer(app);
const onlineUsers = new Map();

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("show_typing", data);
  });

  socket.on("stop_typing", (data) => {
    socket.broadcast.emit("hide_typing", data);
  });

  socket.on("send_message", (data) => {
    const receiverSocketId = onlineUsers.get(String(data.readerId));

    const senderSocketId = onlineUsers.get(String(data.senderId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", data);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receive_message", data);
    }
  });

  socket.on("seen_message", async (data) => {
    await Message.updateMany(
      {
        senderId: data.senderId,
        readerId: data.receiverId,
        seen: false,
      },
      { seen: true },
    );

    const receiverSocketId = onlineUsers.get(String(data.senderId));

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message_seen", {
        senderId: data.senderId,
        receiverId: data.receiverId,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));

    console.log("User Disconnected");
  });

  socket.on("delete_message", (data) => {
    io.emit("receive_delete_message", data);
  });
});
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use("/user", userrouter);
app.use("/message", mesrouter);

server.listen(3000, () => {
  (console.clear(), console.log("Server Running"));
});
