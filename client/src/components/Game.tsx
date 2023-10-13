import { useState, useEffect } from "react";
import "../css/App.css";

export default function Game({
  name,
  users,
  setUsers,
  user,
  socket,
  identifier,
}) {
  const [isRunning, setIsRunnig] = useState<boolean>(false);
  const [cards, setCards] = useState<string[]>([]);
  const [isRoundEnd, setIsRoundEnd] = useState<boolean>(false);
  const [playedCard, setPlayedCard] = useState<string>("");

  const handleStartGame = () => {
    socket.emit("update_isRunning", !isRunning);
  };

  const handleNextRound = () => {
    socket.emit("set_next_round");
    cleanGame();
    setIsRoundEnd(false);
  };

  const handleCardClick = (card) => {
    socket.emit("played_card", { card, id: user.id });
    setPlayedCard(card);
    const newCards = cards.filter((item) => {
      if (item !== card) return item;
    });

    setCards(newCards);
  };

  const setOponentsCards = (data) => {
    const tmpUsers = [...users];
    const i = tmpUsers.map((item) => item.id).indexOf(data.id);
    tmpUsers[i].playedCard = data.card;
    console.log(tmpUsers);
    setUsers(tmpUsers);
  };

  const cleanGame = () => {
    setPlayedCard("");
    let tmpUsers = [...users];
    tmpUsers.forEach((item) => {
      item.playedCard = "";
    });
    setUsers(tmpUsers);
  };

  useEffect(() => {
    socket.on("end_game", () => {
      setIsRunnig(false);
      console.log("game finished");
    });

    socket.on("set_isRunning", (runningState) => {
      setIsRunnig(runningState);
      if (isRunning) {
        cleanGame();
      }
    });

    socket.on("send_cards", (cards) => {
      setCards(cards);
    });

    socket.on("send_played_card", (data) => {
      setOponentsCards(data);
    });

    return () => {
      socket.off("end_game");
      socket.off("set_isRunning");
      socket.off("send_cards");
      socket.off("send_played_card");
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
                <button disabled={!isRoundEnd} onClick={handleNextRound}>
                  Next Round
                </button>
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

        {/* board */}
        {isRunning ? (
          <div className="board" style={{ backgroundColor: "red" }}>
            {/* render oponents */}
            <div className="oponents-container">
              {users?.map(
                (item) =>
                  user.id !== item.id && (
                    <div className="oponent" key={item.id}>
                      <div
                        className="player-name"
                        style={{
                          color: item.color.font,
                          backgroundColor: item.color.bg,
                          border: item.isAdmin
                            ? "solid red 1px"
                            : "solid black 1px",
                        }}
                      >
                        {item.name}
                      </div>

                      {/* played oponent card */}
                      <figure className="playing-card">
                        {item.playedCard != "" && (
                          <img
                            src={`../src/assets/cards/${item.playedCard}.png`}
                          />
                        )}
                      </figure>
                    </div>
                  )
              )}
            </div>

            <div className="playing-field">
              <figure className="playing-card">
                {playedCard && (
                  <img src={`../src/assets/cards/${playedCard}.png`} />
                )}
              </figure>
            </div>

            {/* render own cards */}
            <div className="card-container">
              {cards &&
                cards.map((card) => (
                  <figure
                    className="playing-card"
                    onClick={() => handleCardClick(card)}
                    key={card}
                  >
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
