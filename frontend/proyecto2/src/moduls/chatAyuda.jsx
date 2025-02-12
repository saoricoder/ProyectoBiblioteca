import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const ChatAyuda = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Estado para saber si es admin
  const Url = "http://localhost:5261/chatHub";

  useEffect(() => {
    // Evitar reconexiones innecesarias si ya hay un nombre de usuario
    if (userName) return;

    const generatedUserName = `user_${
      Math.floor(Math.random() * 9000000) + 1000000
    }`;
    setUserName(generatedUserName);

    // Simulación de lógica para saber si es admin (puedes cambiarlo)
    const adminList = ["admin_1234567", "admin_9999999"]; // Lista de admins ficticia
    const isAdminUser = adminList.includes(generatedUserName);
    setIsAdmin(isAdminUser);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(Url, {
        transport: signalR.HttpTransportType.WebSockets,
        headers: {
          IsAdmin: isAdminUser.toString(), // true o false
          UserName: generatedUserName,
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Conectado a SignalR como:", generatedUserName);
        setConnection(newConnection);

        // Enviar mensaje de bienvenida al usuario
        const welcomeMessage = isAdminUser
          ? `👑 Bienvenido admin: ${generatedUserName}`
          : `👋 Bienvenido usuario: ${generatedUserName}`;

        setMessages((prev) => [
          ...prev,
          { user: "Servidor", text: welcomeMessage },
        ]);

        // Escuchar los mensajes recibidos
        newConnection.on("ReceiveMessage", (user, receivedMessage) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user, text: receivedMessage },
          ]);
        });
      })
      .catch((err) => {
        console.error("❌ Error en la conexión:", err);
        setTimeout(() => newConnection.start(), 5000);
      });

    return () => {
      newConnection.stop();
    };
  }, [userName]);

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
        .invoke("SendMessage", userName, message)
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

export default ChatAyuda;
