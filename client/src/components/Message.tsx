import "../css/App.css";

export default function Message({ message, identifier, index }) {
  return (
    <>
      <div className="message-container" key={`${index}${identifier}`}>
        {/* Eigenen Nachrichten */}
        {message.id === identifier && (
          <div className="mb-2">
            <div
              className="message"
              style={{
                backgroundColor: message.color.bg,
                color: message.color.font,
              }}
            >
              {message.text}
            </div>
            <div className="">You</div>
          </div>
        )}

        {/* Fremde Nachrichten */}
        {message.id != identifier && (
          <div className="d-flex justify-content-end flex-column align-end mb-2">
            <div
              className="message"
              style={{
                backgroundColor: message?.color?.bg,
                color: message?.color?.font,
              }}
            >
              {message.text}
            </div>
            <div className="">{message.user}</div>
          </div>
        )}
      </div>
    </>
  );
}
