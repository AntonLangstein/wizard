import { useState, useEffect } from "react";
import "./scss/App.scss";
import io from "socket.io-client";
// import Game from "./components/Game";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { Container } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

const socket = io.connect("http://localhost:3001");

type User = {
  id: string;
  room: string;
  name: string;
};

function App() {
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    return () => {
      socket.off("");
    };
  }, [socket]);

  return (
    <>
      <main>
        <Container>
          <div className="d-flex gap-2">
            <Link to="/">Home</Link>
            <Link to="/room">Room</Link>
          </div>
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
