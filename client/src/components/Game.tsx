import { useState, useEffect } from "react";
import "../css/App.css";

export default function Game({ name, users, user, socket, identifier }) {
  const [isRunning, setIsRunnig] = useState(false);
  const [cards, setCards] = useState([]);

  const handleStartGame = () => {
    socket.emit("update_isRunning", !isRunning);
  };

  const handleNextRound = () => {
    socket.emit("set_next_round");
  };

  useEffect(() => {
    socket.on("end_game", () => {
      setIsRunnig(false);
      console.log("game finished");
    });

    socket.on("set_isRunning", (runningState) => {
      setIsRunnig(runningState);
    });

    socket.on("send_cards", (cards) => {
      setCards(cards);
      console.log(cards);
    });

    return () => {
      socket.off("end_game");
      socket.off("set_isRunning");
      socket.off("send_cards");
    };
  }, [socket]);

  return (
    <>
      <div className="c-game">
        <div className="top-bar">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h1>{name}</h1>
              <h2>Users: {users ? users.length : "/"}</h2>
            </div>
            {user?.isAdmin && (
              <div className="admin-panel">
                <button onClick={handleStartGame}>
                  {isRunning ? "End Game" : "Start Game"}
                </button>
                <button onClick={handleNextRound}>Next Round</button>
              </div>
            )}
          </div>
        </div>

        <div className="side-bar">
          <div className="users">
            {users &&
              users.map((user) => (
                <div
                  className="user"
                  key={user.id}
                  style={{
                    color: user.color.font,
                    backgroundColor: user.color.bg,
                    border: user.isAdmin ? "solid red 1px" : "solid black 1px",
                  }}
                >
                  {user.name}
                </div>
              ))}
            {}
          </div>
        </div>
        {isRunning ? (
          <div className="board" style={{ backgroundColor: "red" }}>
            {/* render oponents */}
            <div className="oponents-container">
              {users.map((_user) =>
                user.id !== _user.id ? (
                  <div className="oponent">{_user.name}</div>
                ) : (
                  ""
                )
              )}
            </div>

            <div className="playing-field">hallo</div>

            {/* render own cards */}
            <div className="card-container">
              {cards &&
                cards.map((card) => (
                  <figure className="playing-card" key={card}>
                    <img src={`../src/assets/cards/${card}.png`} />
                  </figure>
                ))}
            </div>
          </div>
        ) : (
          <div
            className="board justify-content-center align-center"
            style={{ backgroundColor: "purple" }}
          >
            <h2>Der Admin muss das Spiel Starten</h2>
          </div>
        )}
      </div>
    </>
  );
}
