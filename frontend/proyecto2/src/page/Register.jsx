import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register } from "../services/user.services/Login.services";
import "../css/Register.css";
import { MenuHeader } from "../moduls/Menu_header";

export function RegisterForm() {
  const menuItems = [
    { link: "/home", title: "Inicio" },
    { link: "/", title: "Iniciar Sesion" },
    /* {
      isButton: true,
      title: "Cerrar sesión",
      action: handleLogout,  // Enviamos el método para cerrar sesión
    }, */
  ];
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [role, setRole] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito(false);
    setError("");

    if (usuario.trim() === "" || password.trim() === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await Register({
        userName: usuario,
        password,
        Role: role,
      });

      if (response.success) {
        setExito(true);
        setPassword("");
        setUsuario("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Mostrar el mensaje detallado del error
        setError(response.error || "Error al registrar usuario");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container">
      <MenuHeader menuItems={menuItems} />
      <h1>Registro de Usuario</h1>
      <div className="container_form">
        <form className="form_login" onSubmit={handleSubmit} autoComplete="off">
          <div className="item_login">
            <label htmlFor="usuario" className="item_title">
              Usuario
            </label>
            <input
              className="login_info"
              type="text"
              name="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="item_login">
            <label htmlFor="password" className="item_title">
              Password
            </label>
            <div className="password_container">
              <input
                className="login_info"
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle_password"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="item_login">
            <label htmlFor="role" className="item_title">
              Role
            </label>
            <select
              className="login_info"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Seleccionar rol</option>
              {/* Opción por defecto */}
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="item_login">
            <input className="login_button" type="submit" value="Registrar" />
          </div>
        </form>
      </div>
      {error && <p className="error">{error}</p>}
      {exito && (
        <p className="exito">Registro exitoso! Redirigiendo al login...</p>
      )}
    </div>
  );
}
