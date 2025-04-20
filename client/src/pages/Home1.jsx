import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UsernamePrompt from "../components/UsernamePrompt";
import socket from "../socket"; // Import the shared socket instance
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom"; // Import useParams to get the roomId from the URL

export default function Home1() {
  const { user } = useUser();
  const { roomId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // Handle "room_full" event from the backend
    socket.on("room_full", () => {
      alert("The room is full. Please try another room.");
    });

    // Handle "room_joined" event from the backend
    socket.on("room_joined", ({ room, username }) => {
      // Save in localStorage for later use in EditorRoom
      localStorage.setItem("username", username);
      localStorage.setItem("room", room);
      navigate(`/room/${room}`);
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("room_full");
      socket.off("room_joined");
    };
  }, [navigate]);

  const handleJoin = ({ username, room }) => {
    // Emit "join_room" event to the backend
    socket.emit("join_room", { username, room });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <UsernamePrompt
        onJoin={handleJoin}
        firstName={user.firstName}
        room={roomId}
      />
    </div>
  );
}
