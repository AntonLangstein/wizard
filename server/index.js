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
const maxUsers = 6;
let isRunning = false;
let round = 4;
let colors = [
  { bg: "darkcyan", font: "black" },
  { bg: "crimson", font: "black" },
  { bg: "orange", font: "black" },
  { bg: "purple", font: "white" },
  { bg: "aquamarine", font: "black" },
  { bg: "dodgerblue", font: "black" },
];
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

io.on("connection", (socket) => {
  io.emit("connection", "Bin da");
  socket.on("disconnect", () => {});
});
