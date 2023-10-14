import { useState, useEffect } from "react";
import "./css/App.css";
import io from "socket.io-client";
// import Game from "./components/Game";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { Container } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

const socket = io.connect("http://localhost:3001");

// type User = {
//   id: string;
//   name: string;
//   color: { bg: string; font: string };
//   isAdmin: boolean;
//   playedCard: string;
// };

function App() {
  const [text, setText] = useState<string>("text");

  useEffect(() => {
    return () => {
      socket.off("");
    };
  }, [socket]);

  return (
    <>
      <main>
        <Container>
          <Link to="/">Home</Link>
          <Link to="/room">Room</Link>
          <Routes>
            <Route path="/" element={<Home props={{ socket }} />}></Route>
            <Route path="/room" element={<Room props={{ socket }} />}></Route>
            {/* <Route path="/room" element={<Room props={{ text }} />}></Route> */}
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
