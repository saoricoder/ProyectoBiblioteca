import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/formulario.css";
import { Login } from "../services/user.services/Login.services";
export function Formulario() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito(false);
    if (usuario.trim() === "" || password.trim() === "") {
      setError(true);
      return;
    }

    try {
      const response = await Login({
        userName: usuario,
        password,
      });

      if (response.success) {
        setExito(true);
        setPassword("");
        setUsuario("");
        console.log("Login exitoso", response.data);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setError(response.error || "Error al iniciar sesion");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error al conectar con el servidor");
    }
  };
  return (
    <div className="container">
      <h1>Inicio de Sesion</h1>
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
              id="usuario"
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
                id="password"
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
            <input
              className="login_button"
              type="submit"
              value="Iniciar Sesion"
            />
          </div>
        </form>
        {error && <p className="error">Todos los campos son obligatorios</p>}
        {exito && <p className="exito">Registro exitoso</p>}
      </div>
    </div>
  );
}
