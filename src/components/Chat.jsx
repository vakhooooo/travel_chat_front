import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://travel-api-chat.onrender.com");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("receiveMessage", (message) => {
      console.log("Message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    console.log("Sending message:", input);
    socket.emit("sendMessage", input);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
