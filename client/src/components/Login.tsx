import "../css/App.css";

export default function Chat({ setName }) {
  return (
    <>
      <div className="c-login">
        <form
          className="c-login--form"
          onSubmit={(e) => setName(e.target["name-input"].value)}
        >
          <h1>Wizard</h1>
          <div className="d-flex gap-2">
            <input id="name-input" type="text" />
            <button type="submit">Name bestätigen</button>
          </div>
        </form>
      </div>
    </>
  );
}
