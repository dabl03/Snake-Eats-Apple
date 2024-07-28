/**Dimensiones de un rectangulo y ubicación.
 * 
 * @param x Posición x de la pantalla.
 * @param y Posición y de la pantalla.
 * @param width Width del rectangulo.
 * @param width Height del rectangulo.
 */
class Dim {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
/**
 * Dim.new_dim: Función estática que hace un constructor alternativo al predeterminado de la clase Dim.
 * @param {dim}: Una instancia de la clase dim, será usada para retornar una nueva clase Dim.
 * @return {new Dim}.
 */
Dim.new_dim = (dim) => new Dim(
  dim.x,
  dim.y,
  dim.width,
  dim.height,
  dim.element
);