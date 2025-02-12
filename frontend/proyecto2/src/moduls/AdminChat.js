import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const AdminChat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  //const [message, setMessage] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  //const [userName, setUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const Url = "http://localhost:5261/chatHub";

  useEffect(() => {
    const generatedUserName = `admin_${
      Math.floor(Math.random() * 9000000) + 1000000
    }`;
    //setUserName(generatedUserName);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${Url}?IsAdmin=true&UserName=${encodeURIComponent(generatedUserName)}`,
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
        console.log("✅ Conectado a SignalR como:", generatedUserName);
        setConnection(newConnection);
      })
      .catch((err) => {
        console.error("❌ Error en la conexión:", err);
        setTimeout(() => newConnection.start(), 5000);
      });

    newConnection.on("ReceiveMessage", (user, receivedMessage) => {
      setMessages((prevMessages) => {
        // Asegurarse de no duplicar mensajes solo si el último mensaje es del mismo usuario
        if (
          prevMessages.length === 0 ||
          prevMessages[prevMessages.length - 1].text !== receivedMessage ||
          prevMessages[prevMessages.length - 1].user !== user // Diferenciar entre el emisor
        ) {
          return [...prevMessages, { user, text: receivedMessage }];
        }
        return prevMessages;
      });
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  /* const sendMessage = async () => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("La conexión aún no está lista.");
      return;
    }

    if (message.trim() !== "") {
      await connection
        .invoke("SendMessageToAdmins", userName, message)
        .catch((err) => {
          console.error("Error al enviar el mensaje:", err);
        });
      setMessage("");
    }
  }; */

  const sendAdminMessage = async () => {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("La conexión aún no está lista.");
      return;
    }

    if (adminMessage.trim() !== "" && selectedUser) {
      await connection
        .invoke("SendMessageToUser", selectedUser, adminMessage)
        .catch((err) => {
          console.error("Error al enviar respuesta manual:", err);
        });
      setAdminMessage("");
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
            style={{ height: "200px", overflowY: "auto", marginBottom: "10px" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: msg.user.includes("admin_")
                    ? "#ccc"
                    : "#007bff",
                  color: msg.user.includes("admin_") ? "black" : "white",
                  padding: "5px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "80%", padding: "5px", marginRight: "5px" }}
          />
          <button onClick={sendMessage} style={{ padding: "5px" }}>
            Enviar
          </button> */}

          <h3>Respuestas del Administrador</h3>
          <select
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
          >
            <option value="" disabled>
              Seleccionar usuario
            </option>
            {[...new Set(messages.map((msg) => msg.user))].map(
              (user, index) => (
                <option key={index} value={user}>
                  {user}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            style={{ width: "80%", padding: "5px", marginRight: "5px" }}
            placeholder="Escribe un mensaje de respuesta"
          />
          <button onClick={sendAdminMessage} style={{ padding: "5px" }}>
            Enviar Respuesta
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
