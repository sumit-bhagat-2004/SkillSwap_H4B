import { useState } from "react";

export default function UsernamePrompt({ onJoin, firstName, room }) {
  const [username, setUsername] = useState(firstName || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      onJoin({ username, room });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-xl shadow-xl max-w-md w-full mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Join or Create Room</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Enter room code"
        value={room}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Enter Room
      </button>
    </form>
  );
}
