export const getLibros = () => {
  try {
    console.log("get libro");
  } catch (error) {
    return {};
  }
};

export const postLibro = (libro) => {
  try {
    console.log("post Libro" + libro);
  } catch (error) {
    return {};
  }
};
export const deleteLibro = (id) => {
  try {
    console.log("delete Libro" + id);
  } catch (error) {
    return {};
  }
};
export const updateLibro = (libro) => {
  try {
    console.log("update Libro" + libro);
  } catch (error) {
    return {};
  }
};
