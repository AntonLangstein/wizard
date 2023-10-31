const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

server.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3001");
});

// ----------------------------------------------------------------

let users = [];
let isRunning = false;

let round = 4;
let colors = [];
const baseColors = [
  { bg: "darkcyan", font: "black" },
  { bg: "LightCoral", font: "black" },
  { bg: "orange", font: "black" },
  { bg: "purple", font: "white" },
  { bg: "aquamarine", font: "black" },
  { bg: "dodgerblue", font: "black" },
];

const maxRoomUsers = baseColors.length > 6 ? 6 : baseColors.length;
let cards = [
  "b01",
  "b02",
  "b03",
  "b04",
  "b05",
  "b06",
  "b07",
  "b08",
  "b09",
  "b10",
  "b11",
  "b12",
  "b13",
  "r01",
  "r02",
  "r03",
  "r04",
  "r05",
  "r06",
  "r07",
  "r08",
  "r09",
  "r10",
  "r11",
  "r12",
  "r13",
  "g01",
  "g02",
  "g03",
  "g04",
  "g05",
  "g06",
  "g07",
  "g08",
  "g09",
  "g10",
  "g11",
  "g12",
  "g13",
  "y01",
  "y02",
  "y03",
  "y04",
  "y05",
  "y06",
  "y07",
  "y08",
  "y09",
  "y10",
  "y11",
  "y12",
  "y13",
  "yww",
  "rww",
  "gww",
  "bww",
  "ynn",
  "rnn",
  "gnn",
  "bnn",
];
let rndNum;

const createRndNum = (max) => {
  return Math.floor(Math.random() * max);
};

removeUserFromList = (socket) => {
  let currentRoom;
  Object.keys(users).forEach((key, index) => {
    // set current room and add color back to color list
    users[key] = users[key].filter((user) => {
      if (user.id === socket.id) {
        currentRoom = user.room;
        colors[currentRoom].push(user.colors);
        return false;
      }
      return true;
    });
  }, users);

  io.to(currentRoom).emit("send_users_to_client", users[currentRoom]);
};

// ----------------------------------------------------------------

io.on("connection", (socket) => {
  // send the list of users to the client
  socket.on("send_user_data_to_server", (data) => {
    // error handeling
    if (
      data.userName === null ||
      data.userName === undefined ||
      data.room === null ||
      data.room === undefined
    ) {
      io.to(socket.id).emit("user:error", "no username or room");
      socket.disconnect();
      return;
    }
    // if room full
    if (users[data.room]) {
      if (users[data.room].length >= maxRoomUsers) {
        io.to(socket.id).emit("user:error", "room is full");
        socket.disconnect();
        return;
      }
    }

    // joining Room
    socket.join(data.room);

    // set User color
    if (!colors[data.room]) colors[data.room] = [...baseColors];
    rndNum = createRndNum(colors[data.room].length);

    let user = {
      id: socket.id,
      name: data.userName,
      room: data.room,
      isAdmin: false,
      colors: colors[data.room][rndNum],
    };

    // remove color from color list
    colors[data.room].splice(rndNum, 1);

    // pushing user in room list
    if (!users[data.room]) users[data.room] = [];
    users[data.room].push(user);

    // check Admin
    let hasAdmin = false;
    users[data.room].forEach((user) => {
      if (user.isAdmin) hasAdmin = true;
    });
    if (!hasAdmin) users[data.room][0].isAdmin = true;

    // sending users
    io.to(data.room).emit("send_users_to_client", users[data.room]);
  });

  // trigger if user leaves
  socket.on("user:leave", () => {
    removeUserFromList(socket);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    removeUserFromList(socket);
  });
});
