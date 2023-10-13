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

const handleNewRndNum = () => {
  colors.splice(rndNum, 1);
  rndNum = createRndNum(colors.length);
};

const setCards = () => {
  const cardsAmount = users.length * round;
  let roundCards = [];

  for (let i = 0; i < cardsAmount; i++) {
    let rndCardNum = createRndNum(cards.length);

    if (i >= 1) {
      while (roundCards.includes(cards[rndCardNum])) {
        rndCardNum = createRndNum(cards.length);
      }
    }
    roundCards.push(cards[rndCardNum]);
  }

  for (let i = 0; i < users.length; i++) {
    let roundPlayerCards = [];

    for (let j = 0; j < round; j++) {
      roundPlayerCards.push(roundCards[0]);
      roundCards.shift();
    }
    io.to(users[i].id).emit("send_cards", roundPlayerCards);
  }
};

const createRndNum = (max) => {
  return Math.floor(Math.random() * max);
};

rndNum = createRndNum(colors.length);

io.on("connection", (socket) => {
  // just allow a certain amount of users
  if (users.length >= maxUsers) socket.disconnect();
  // disconnet if the game is running
  if (isRunning) socket.disconnect();

  socket.emit("new_user");

  // send the users to the client
  socket.on("send_name_to_server", (data) => {
    const user = {
      id: socket.id,
      name: data.name,
      color: colors[rndNum],
      isAdmin: false,
      playedCard: "",
    };
    users.push(user);
    users[0].isAdmin = true;

    io.emit("set_users", users);

    handleNewRndNum();
  });

  // receving is running state
  socket.on("update_isRunning", (runningState) => {
    if (runningState) {
      round = 1;
      setCards();
    }

    isRunning = runningState;
    io.emit("set_isRunning", runningState);
  });

  socket.on("set_next_round", () => {
    round++;
    setCards();
  });

  socket.on("played_card", (data) => {
    io.emit("send_played_card", data);
  });

  // get message an send it to all users
  socket.on("message", (data) => {
    socket.broadcast.emit("retrive_message", data);
  });

  socket.on("disconnect", () => {
    // remove the disconnected user from the list of users
    users.forEach((user, i) => {
      if (user.id === socket.id) {
        colors.push(users[i].color);
        users.splice(i, 1);

        // if admin leaves, the game will end
        if (user.isAdmin) {
          isRunning = false;
          io.emit("end_game");
        }
      }
    });

    users[0].isAdmin = true;
    io.emit("set_users", users);
  });
});
