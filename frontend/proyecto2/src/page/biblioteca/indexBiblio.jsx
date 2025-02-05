import { MenuHeader } from "../../moduls/Menu_header";

export function IndexBiblio() {
  return (
    <div className="container">
      <MenuHeader />
      <h1 className="title_index">Biblioteca</h1>
      <div className="container_biblio">
        <ul className="biblio">
          <li className="biblio_item">Libros</li>
          <li className="biblio_item">Revistas</li>
          <li className="biblio_item">Periodicos</li>
          <li className="biblio_item">Tesis</li>
          <li className="biblio_item">Investigaciones</li>
        </ul>
      </div>
    </div>
  );
}
