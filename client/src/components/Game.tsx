import { useState, useEffect } from "react";

export default function Game({ users, user, socket }) {
  const [isRunning, setIsRunnig] = useState<boolean>(false);
  const values = ["b13", "b13", "b13", "b13", "b13"];

  useEffect(() => {
    return () => {
      socket.off();
    };
  }, [socket]);

  return (
    <>
      <div className="c-game">
        {/* users */}
        <div className="d-flex gap-4">
          {users &&
            users.map(
              (_user) =>
                user.id !== _user.id && (
                  <div
                    className="o-card--user"
                    style={{
                      color: _user.colors.font,
                      backgroundColor: _user.colors.bg,
                    }}
                    key={_user.id}
                  >
                    <span className="o-card--user--name">{_user.name}</span>
                  </div>
                )
            )}
        </div>

        {/* board */}
        <div className="c-game--board">
          <div className="played-cards">
            {values.map((card, i) => (
              <figure style={{ left: i * 100 }}>
                <img src={`../src/assets/cards/${card}.png`} alt={card} />
              </figure>
            ))}
          </div>
        </div>

        {/* own deck */}
        {user && (
          <div
            className="c-game--own-deck"
            style={{ color: user.colors.font, backgroundColor: user.colors.bg }}
          >
            <div className="">{user.name}</div>
            <div className="d-flex gap-3">
              <figure>
                <img src="../src/assets/cards/b13.png" alt="" />
              </figure>
              <figure>
                <img src="../src/assets/cards/b13.png" alt="" />
              </figure>
              <figure>
                <img src="../src/assets/cards/b13.png" alt="" />
              </figure>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
