import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserList from "../components/userList";

type User = {
  id: string;
  room: string;
  name: string;
  isAdmin: boolean;
  colors: { bg: string; font: string };
};

export default function Room({ props }) {
  const socket = props.socket;

  const [userName, setUserName] = useState<string>();
  const [room, setRoom] = useState<string>();
  const [users, setUsers] = useState<User[]>();
  const [user, setUser] = useState<User>();
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

  const handleUserLeave = () => {
    console.log("triggerUserLeave");

    socket.emit("user:leave");
  };

  const getUser = (users: User[]) => {
    users.forEach((user: User) => {
      if (socket.id === user.id) setUser(user);
    });
  };

  useEffect(() => {
    sendUserData();
  }, []);

  useEffect(() => {
    socket.on("send_users_to_client", (data: User[]) => {
      setUsers(data);
      getUser(data);
      console.log(data);
    });

    socket.on("user:error", (error: string) => {
      setError(error);
    });

    return () => {
      socket.off("send_users_to_client");
      socket.off("user:error");
    };
  }, [socket]);

  return (
    <>
      <div className="d-flex justify-content-between gap-2">
        <Link to="/">
          <div className="o-button--primary" onClick={() => handleUserLeave()}>
            Leave
          </div>
        </Link>
        <div className="d-flex">
          {user && user.isAdmin && (
            <button className="o-button--primary">Start Game</button>
          )}
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      <div className="d-flex justify-content-between mt-5">
        <h1>{room}</h1>
        {user && <h2 style={{ color: user.colors.bg }}>{user.name}</h2>}
      </div>

      {/* render user */}
      <UserList users={users} />
    </>
  );
}
