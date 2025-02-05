import { Formulario } from "./page/Formulario";
import "./App.css";
import { MenuHeader } from "./moduls/Menu_header";

function App() {
  return (
    <div className="container">
      <MenuHeader
        title1={"Home"}
        link1={"/"}
        title2="Registro"
        link2="/signup"
      ></MenuHeader>
      <Formulario />
    </div>
  );
}

export default App;
