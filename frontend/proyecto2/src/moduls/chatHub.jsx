import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const HelpChat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [userName, setUserName] = useState(""); // Guarda el nombre de usuario único
  const Url = "http://localhost:5286/chatHub"; // URL del backend

  useEffect(() => {
    setUserName("");
    setMessages([]);
    const generatedUser = `user_${
      Math.floor(Math.random() * 9000000) + 1000000
    }`;
    setUserName(generatedUser);
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${Url}?IsAdmin=false&UserName=${encodeURIComponent(generatedUser)}`,
        {
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Conectado a SignalR como:", generatedUser);
        setConnection(newConnection);
        window.chatConnection = newConnection;
      })
      .catch((err) => {
        console.error("❌ Error en la conexión:", err);
        setTimeout(() => newConnection.start(), 5000);
      });

    newConnection.on("ReceiveMessage", (user, receivedMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user, text: receivedMessage },
      ]);
    });

    newConnection.on("WelcomeMessage", (welcomeText) => {
      setMessages([]);
      setMessages([{ user: "Sistema", text: welcomeText }]);
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("⚠️ La conexión aún no está lista.");
      return;
    }

    if (message.trim() !== "" && userName) {
      await connection
        .invoke("SendMessageToAdmins", userName, message) // Solo se envía el mensaje, no el usuario
        .catch((err) => console.error("❌ Error al enviar el mensaje:", err));
      setMessage("");
    }
  };

  return (
    <div>
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "20px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setChatOpen(!chatOpen)}
      >
        ?
      </button>

      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              height: "200px",
              overflowY: "auto",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: msg.user === userName ? "#007bff" : "#ccc",
                  color: msg.user === userName ? "white" : "black",
                  padding: "5px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  alignSelf: msg.user === userName ? "flex-end" : "flex-start",
                }}
              >
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "80%", padding: "5px", marginRight: "5px" }}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={sendMessage} style={{ padding: "5px" }}>
            🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpChat;
