

# Mi Tienda Ecommerce

"Mi Tienda Ecommerce" es una aplicación web responsiva que simula una tienda online básica. Permite a los usuarios explorar productos, añadirlos a un carrito de compras, ajustar cantidades, eliminar artículos y proceder a un proceso de pago simulado. El proyecto se enfoca en un diseño minimalista utilizando Bootstrap  y la carga dinámica de contenido con JavaScript.

-----

## 🚀 Características

  * **Listado de Productos**: Muestra una lista dinámica de productos obtenidos de una API pública. (dummyjson)
  * **Diseño Responsivo**: Optimizado para varios tamaños de pantalla (móviles, tabletas, escritorios) usando Bootstrap.
  * **Carrito de Compras**:
      * Añade productos al carrito.
      * Se puede modificar las cantidades de los productos directamente en el carrito.
      * Elimina productos del carrito.
      * **Persistencia de Datos**: Los datos del carrito se guardan usando `localStorage`, por lo que los artículos permanecen incluso si el usuario cierra el navegador.
      * Actualización en tiempo real del contador de artículos del carrito en el encabezado.
  * **Proceso de Pago**: Un formulario de pago simplificado que simula una transacción exitosa y vacía el carrito.
  * **Feedback al Usuario**: Proporciona mensajes claros para las acciones del carrito (añadir, actualizar, eliminar) y el estado del pago.
  * **Enlace Externo**: Incluye un enlace a un proyecto anterior ("Mi Tienda de Colchones") en el encabezado. Este enlace corresponde al TP Final Integrador, antes del cambio de docente.

-----

## 🛠️ Tecnologías Utilizadas

  * **HTML5**: Para la estructura básica de las páginas web.
  * **CSS3**: Estilos personalizados para mejoras visuales y diseños específicos.
  * **JavaScript**: Maneja todas las funcionalidades dinámicas, incluyendo:
      * Obtención de datos de productos de [DummyJSON](https://www.google.com/search?q=https://dummyjson.com/products).
      * Gestión del estado del carrito de compras (añadir, actualizar, eliminar artículos).
      * Actualización dinámica de la interfaz de usuario.
      * Interacción con `localStorage`.
  * **Bootstrap 5.3**: Un potente framework CSS utilizado para el diseño responsivo, el estilo de componentes (tarjetas, tablas, formularios) y el diseño general.
  * **Font Awesome 6**: Para iconos vectoriales escalables que mejoran la interfaz de usuario, lo cual le da un toque de color al sitio (por ejemplo, icono de carrito de compras, icono de añadir producto, iconos de pago).

-----

## 📁 Estructura del Proyecto

```
MiTiendaEcommerce/
├── index.html
├── carrito.html
├── pago.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

  * `index.html`: La página principal que muestra los productos disponibles.
  * `carrito.html`: La página del carrito de compras, donde los usuarios pueden revisar y gestionar sus artículos seleccionados.
  * `pago.html`: La página simulada del formulario de pago/checkout.
  * `css/style.css`: Contiene todas las reglas CSS personalizadas para estilizar la aplicación.
  * `js/script.js`: Contiene toda la lógica JavaScript para el manejo de productos, la gestión del carrito y las actualizaciones dinámicas de la interfaz de usuario.

-----

## 🚀 Cómo Ejecutar

1.  **Abre `index.html`** en tu navegador web.

No se requiere ninguna configuración especial de servidor ni proceso de compilación, ya que es una aplicación del lado del cliente.

-----

## 📝 Uso

1.  **Explorar Productos**: En la página `index.html`, verás una lista de productos.
2.  **Añadir al Carrito**: Haz clic en el botón "Agregar" en cualquier tarjeta de producto para añadirlo a tu carrito. Verás cómo se actualiza el contador del carrito en el encabezado.
3.  **Ver Carrito**: Haz clic en el botón "Carrito" en el encabezado para ir a `carrito.html`.
4.  **Gestionar Carrito**:
      * Cambia la cantidad de un artículo ajustando el número en el campo de entrada.
      * Elimina un artículo haciendo clic en el botón "Eliminar" junto a él.
5.  **Proceder al Pago**: En la página del carrito, haz clic en "Finalizar Compra" para ir a `pago.html`. Este botón está deshabilitado si el carrito está vacío.
6.  **Simular Pago**: Completa el formulario de pago (no se procesa ningún pago real) y haz clic en "Pagar Ahora". El carrito se vaciará y aparecerá un mensaje de éxito.
7.  **Volver al Inicio**: Después del pago, puedes hacer clic en "Volver al Inicio" para regresar al listado de productos.





