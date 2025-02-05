import { MenuHeader } from "../../moduls/Menu_header";

export function IndexNom() {
  return (
    <div className="container">
      <MenuHeader />
      <h1 className="title_index">Nomina</h1>
      <div className="container_nom">
        <ul className="nom">
          <li className="nom_item">Tipo de Nomina</li>
          <li className="nom_item">Nomina</li>
          <li className="nom_item">Comprobante de Nomina</li>
          <li className="nom_item">Balance de Nomina</li>
          <li className="nom_item">Estado de Resultados de Nomina</li>
        </ul>
      </div>
    </div>
  );
}
