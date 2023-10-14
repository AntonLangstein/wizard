import { useState, useEffect } from "react";
import "../css/App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import Login from "./Login";
import Game from "./Game";
import { Container } from "react-bootstrap";

const socket = io.connect("http://localhost:3001");
const rndNum = Math.floor(Math.random() * 100).toString();

// type User = {
//   id: string;
//   name: string;
//   color: { bg: string; font: string };
//   isAdmin: boolean;
//   playedCard: string;
// };

function App() {
  useEffect(() => {
    return () => {
      socket.off("");
    };
  }, [socket]);

  return (
    <>
      <main>
        <Container>Ich bin ein text</Container>
      </main>
    </>
  );
}

export default App;
