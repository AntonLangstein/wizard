import { useState, useEffect } from "react";
import Message from "./Message";
import "../css/App.css";

type Message = {
  text: string;
  id: string;
  user: string;
  color: { bg: string; font: string };
};

export default function Chat({ socket, identifier, name, color }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatHidden, setIsChatHidden] = useState<boolean>(true);

  const handleChatForm = (event) => {
    event.preventDefault();
    if (event.target["chat-message"].value.length <= 0) return;

    const text = {
      text: event.target["chat-message"].value,
      id: identifier,
      user: name,
      color,
    };

    setMessages((prev: Message[]) => [...prev, text]);
    socket.emit("message", text);
    event.target["chat-message"].value = "";
  };

  useEffect(() => {
    socket.on("retrive_message", (textMessage: Message[]) => {
      setMessages((prev: Message[]) => [...prev, textMessage]);
    });

    return () => {
      socket.off("retrive_message");
    };
  }, [socket]);

  return (
    <>
      <div className="c-chat">
        <div
          className="c-chat--top"
          onClick={() => setIsChatHidden(!isChatHidden)}
        ></div>
        <div className={`c-chat--container ${isChatHidden ? "hidden" : ""}`}>
          <div className="c-chat--messages d-flex flex-column">
            {messages.map((message: Message, index: number) => (
              <Message
                message={message}
                index={index}
                identifier={identifier}
              ></Message>
            ))}
          </div>
          <form className="c-chat--form" onSubmit={(e) => handleChatForm(e)}>
            <input id="chat-message" type="text" placeholder="Change Text" />
            <button id="chat-button" type="submit">
              Senden
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
