
// Función para obtener productos de la API
export const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const json = await response.json();
    return json;
  } catch (err) {
    console.error("Error cargando API:", err);
    return [];
  }
};
