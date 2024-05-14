import { useLocation } from "react-router-dom";

type User = {
  username: string;
  socketId: string;
  quizId: string;
  score: number;
};

export const ResultPage = () => {
  const { state } = useLocation();
  const { users } = state;

  return (
    <div className="flex flex-col items-center h-screen w-screen pt-20">
      <h1 className="text-4xl font-bold text-blue-500">Result</h1>
      {state ? (
        <ul className="w-full flex flex-col items-center">
          <li
              className="flex items-center justify-between w-1/2 p-4 bg-white 
                         rounded-lg my-2 border-b-2 border-cyan-500"
            >
              <h2 className="text-lg font-bold text-cyan-500">
                Name
              </h2>
              <h2 className="text-lg font-bold text-cyan-500">
                  Score
                </h2>
            </li>
          {users.map((user: User) => (
            <li
              key={user.socketId}
              className="flex items-center justify-between w-1/2 p-4 bg-white
               rounded-lg my-2 border-2 border-cyan-500"
            >
              <h2 className="text-xl font-bold text-blue-500">
                {user.username}
              </h2>
              <h2 className="text-xl font-bold text-red-500">{user.score}</h2>
            </li>
          ))}
        </ul>
      ) : (
        <h2 className="text-2xl font-bold text-blue-500">No score found</h2>
      )}
    </div>
  );
};
