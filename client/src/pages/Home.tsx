import { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";

function Home({ props }) {
  const socket = props.socket;

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Hallo Home!");
    });

    return () => {
      socket.off("connection");
    };
  }, [socket]);

  return (
    <>
      <h1>Home</h1>
      <form action="room">
        <input type="text" name="user_name" id="user-name" required />
        <select name="room" id="room" required>
          <option value="">--Please choose an option--</option>
          <option value="Room 1">Room 1</option>
          <option value="Room 2">Room 2</option>
          <option value="Room 3">Room 3</option>
        </select>
        <button type="submit">Join Room</button>
      </form>
    </>
  );
}

export default Home;
