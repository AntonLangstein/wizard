export default function userList({ users }) {
  return (
    <>
      <div className="d-flex flex-column gap-1">
        {users &&
          users.map((user) =>
            user.isAdmin ? (
              <div
                className="o-button--user"
                style={{
                  border: "red solid 1px",
                  color: user.colors.font,
                  backgroundColor: user.colors.bg,
                }}
                key={user.id}
              >
                {user.name}
              </div>
            ) : (
              <div
                className="o-button--user"
                style={{
                  color: user.colors.font,
                  backgroundColor: user.colors.bg,
                }}
                key={user.id}
              >
                {user.name}
              </div>
            )
          )}
      </div>
    </>
  );
}
