import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

type User = {
  id: string;
  room: string;
  name: string;
};

function Room({ props }) {
  const socket = props.socket;

  const [userName, setUserName] = useState<string>();
  const [room, setRoom] = useState<string>();
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState<string>();
  let alreadySendUser = false;

  const sendUserData = () => {
    if (!alreadySendUser) {
      const queryParameters = new URLSearchParams(window.location.search);
      const queryUserName = queryParameters.get("user_name");
      const queryRoom = queryParameters.get("room");

      setUserName(queryUserName);
      setRoom(queryRoom);

      socket.emit("send_user_data_to_server", {
        userName: queryUserName,
        room: queryRoom,
      });

      alreadySendUser = true;
    }
  };

  const triggerError = (error: string) => {
    setError(error);
  };

  useEffect(() => {
    sendUserData();
  }, []);

  useEffect(() => {
    socket.on("send_users_to_client", (data: User[]) => {
      setUsers(data);
    });

    socket.on("user:unknown", (error: string) => {
      triggerError(error);
    });

    return () => {
      socket.off("send_users_to_client");
      socket.off("user:unknown");
    };
  }, [socket]);

  return (
    <>
      {error && <div className="error">{error}</div>}
      <div className="d-flex">
        <div className="o-button--primary">Start Game</div>
      </div>
      <div className="h1">{room}</div>
      <div className="users">
        {users &&
          users.map((user) => (
            <div className="user" key={user.id}>
              {user.name}
            </div>
          ))}
      </div>
    </>
  );
}

export default Room;
