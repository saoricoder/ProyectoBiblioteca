import { MenuHeader } from "../../moduls/Menu_header";

export function IndexSelec() {
  return (
    <div className="container">
      <MenuHeader />
      <h1 className="title_index">Seleccion</h1>
      <div className="container_selec">
        <ul className="selec">
          <li className="selec_item">Solicitud de Empleo</li>
          <li className="selec_item">Entrevista</li>
          <li className="selec_item">Pruebas</li>
          <li className="selec_item">Contratacion</li>
        </ul>
      </div>
    </div>
  );
}
