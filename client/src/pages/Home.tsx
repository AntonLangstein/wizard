import { useEffect } from "react";

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
      <div className="c-login">
        <form className="c-login--form" action="room">
          <h1>Home</h1>
          <input type="text" name="user_name" id="user-name" required />
          <select name="room" id="room" required>
            <option value="">Choose a room </option>
            <option value="Room 1">Room 1</option>
            <option value="Room 2">Room 2</option>
            <option value="Room 3">Room 3</option>
          </select>
          <div className="d-flex justify-content-center mt-4">
            <button className="o-button--primary" type="submit">
              Join Room
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Home;
