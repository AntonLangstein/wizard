import { useState, useEffect } from "react";
import "../css/App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import Login from "./Login";
import Game from "./Game";
import { Container } from "react-bootstrap";

const socket = io.connect("http://localhost:3001");
const rndNum = Math.floor(Math.random() * 100).toString();

type User = {
  id: string;
  name: string;
  color: { bg: string; font: string };
};

function App() {
  const [users, setUsers] = useState<User[]>();
  const [user, setUser] = useState<User>();
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("Anton" + rndNum);
  const [color, setColor] = useState({});

  const setOwnUser = (_users) => {
    _users.forEach((user) => {
      if (user.id === socket.id) {
        setUser(user);
        setColor(user.color);
      }
    });
  };

  useEffect(() => {
    socket.on("set_users", (item: User[]) => {
      setUsers(item);
      setOwnUser(item);
    });

    socket.on("new_user", () => {
      setId(socket.id);
      socket.emit("send_name_to_server", { name, id: socket.id });
    });

    return () => {
      socket.off("new_user");
      socket.off("set_users");
    };
  }, [socket]);

  return (
    <>
      <main>
        <Container>
          {!name && <Login setName={setName} />}
          {name && (
            <div className="app">
              <Game
                name={name}
                user={user}
                users={users}
                setUsers={setUsers}
                socket={socket}
                identifier={id}
              ></Game>
              <Chat
                socket={socket}
                identifier={id}
                name={name}
                color={user?.color}
              ></Chat>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

export default App;
