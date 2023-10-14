import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

function Room({ props }) {
  const socket = props.socket;

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Hallo Room!");
    });

    return () => {
      socket.off("connection");
    };
  }, [socket]);

  return (
    <>
      <div className="h1">Room</div>
    </>
  );
}

export default Room;
