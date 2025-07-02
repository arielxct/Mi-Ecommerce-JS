// script.js actualizado y corregido
// --- Selectores del DOM ---
const contenedorProductos = document.getElementById("contenedor-productos");
const carritoContenido = document.getElementById("carrito-contenido");
const contadorCarrito = document.getElementById("contador-carrito");
const botonFinalizarCompra = document.getElementById("finalizar-compra-btn"); // Nuevo selector

// --- Estado Global del Carrito ---
// Se inicializa el carrito obteniendo datos de localStorage, o un array vacío si no hay.
// Se usa 'let' porque el carrito puede ser reasignado (ej. al finalizar compra).
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- Inicialización al cargar el DOM ---
// Esto asegura que el script se ejecute solo cuando todo el HTML esté disponible.
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el contador del carrito en el header si existe el elemento.
    if (contadorCarrito) {
        actualizarContador();
    }

    // Cargar y mostrar productos en la página principal si existe el contenedor.
    if (contenedorProductos) {
        fetchProducts(); // Llamada a la nueva función para obtener productos
    }

    // Mostrar el contenido del carrito en la página del carrito si existe el contenedor.
    if (carritoContenido) {
        mostrarCarrito();
    }

    // Asignar evento al botón de finalizar compra si existe.
    // Es mejor asignar eventos con addEventListener que con onclick en el HTML.
    if (botonFinalizarCompra) {
        botonFinalizarCompra.addEventListener('click', finalizarCompra);
    }
});

// --- Funciones de Lógica de Negocio ---

/**
 * Obtiene los productos de la API y los muestra en el contenedor.
 */
async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=12");
        if (!response.ok) { // Verifica si la respuesta HTTP fue exitosa
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        mostrarProductos(data.products);
    } catch (error) {
        console.error("Error cargando productos:", error);
        // Mostrar un mensaje de error amigable al usuario
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `<p class="text-danger">Lo sentimos, no pudimos cargar los productos en este momento. Por favor, intente de nuevo más tarde.</p>`;
        }
    }
}

/**
 * Renderiza los productos obtenidos de la API en el DOM.
 * @param {Array<Object>} productos - Array de objetos producto.
 */
function mostrarProductos(productos) {
    if (!contenedorProductos) return; // Asegurarse de que el elemento exista

    contenedorProductos.innerHTML = ""; // Limpiar antes de agregar nuevos productos

    if (productos.length === 0) {
        contenedorProductos.innerHTML = "<p class='text-center'>No hay productos disponibles en este momento.</p>";
        return;
    }

    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.className = "col-md-4 mb-4"; // Clases de Bootstrap para la columna
        div.innerHTML = `
            <div class="card h-100">
                <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
                <div class="card-body d-flex flex-column"> <h5 class="card-title">${producto.title}</h5>
                    <p class="card-text flex-grow-1">$${producto.price.toFixed(2)}</p> <button class="btn btn-primary w-100 mt-auto agregar-btn" data-id="${producto.id}" data-title="${producto.title}" data-price="${producto.price}">Agregar al Carrito</button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });

    // Asignar event listeners a los botones de "Agregar al Carrito" después de que se han creado.
    // Esto es más eficiente que usar 'onclick' directamente en el HTML y evita problemas con `innerHTML`.
    document.querySelectorAll('.agregar-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = parseInt(event.target.dataset.id);
            const title = event.target.dataset.title;
            const price = parseFloat(event.target.dataset.price);
            agregarAlCarrito(id, title, price);
        });
    });
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * @param {number} id - ID del producto.
 * @param {string} titulo - Título del producto.
 * @param {number} precio - Precio del producto.
 */
function agregarAlCarrito(id, titulo, precio) {
    const productoExistente = carrito.find((item) => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
        showToast(`Cantidad de "${titulo}" actualizada en el carrito.`);
    } else {
        carrito.push({ id, titulo, precio, cantidad: 1 });
        showToast(`"${titulo}" agregado al carrito.`);
    }
    guardarCarrito(); // Guardar y actualizar contador
}

/**
 * Guarda el estado actual del carrito en localStorage y actualiza el contador.
 */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (contadorCarrito) { // Asegurarse de que el elemento exista antes de actualizar
        actualizarContador();
    }
}

/**
 * Renderiza el contenido del carrito en la página del carrito.
 */
function mostrarCarrito() {
    if (!carritoContenido) return; // Asegurarse de que el elemento exista

    if (carrito.length === 0) {
        carritoContenido.innerHTML = "<p class='text-center text-muted'>El carrito está vacío. ¡Agrega algunos productos!</p>";
        // Deshabilitar botón de finalizar compra si el carrito está vacío
        if (botonFinalizarCompra) {
            botonFinalizarCompra.disabled = true;
        }
        return;
    }

    // Habilitar botón de finalizar compra si hay productos
    if (botonFinalizarCompra) {
        botonFinalizarCompra.disabled = false;
    }

    let totalGlobal = 0; // Usar un nombre de variable más específico

    const tablaHTML = `
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${carrito.map((producto, index) => { // Cambiado 'p' a 'producto' para mayor claridad
                    const subtotal = producto.precio * producto.cantidad;
                    totalGlobal += subtotal;
                    return `
                        <tr>
                            <td>${producto.titulo}</td>
                            <td>$${producto.precio.toFixed(2)}</td>
                            <td>
                                <input type="number" 
                                       value="${producto.cantidad}" 
                                       min="1" 
                                       data-index="${index}" 
                                       class="form-control form-control-sm cantidad-input"
                                       aria-label="Cantidad de ${producto.titulo}">
                            </td>
                            <td>$${subtotal.toFixed(2)}</td>
                            <td>
                                <button class="btn btn-danger btn-sm eliminar-btn" data-index="${index}" aria-label="Eliminar ${producto.titulo}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                }).join("")}
                <tr>
                    <td colspan="3" class="text-end"><strong>Total del Carrito:</strong></td>
                    <td colspan="2"><strong>$${totalGlobal.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
    carritoContenido.innerHTML = tablaHTML;

    // Asignar event listeners a los inputs de cantidad y botones de eliminar después de renderizar.
    // Usar delegación de eventos si la tabla se renderiza muchas veces o tiene muchos elementos.
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const index = parseInt(event.target.dataset.index);
            const nuevaCantidad = parseInt(event.target.value);
            cambiarCantidad(index, nuevaCantidad);
        });
    });

    document.querySelectorAll('.eliminar-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.target.dataset.index);
            eliminarProducto(index);
        });
    });
}

/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {number} index - Índice del producto en el array del carrito.
 * @param {number} nuevaCantidad - La nueva cantidad deseada.
 */
function cambiarCantidad(index, nuevaCantidad) {
    // Validación más robusta de la cantidad
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        showToast("La cantidad debe ser un número positivo.", "warning");
        // Restaurar la cantidad anterior si la entrada es inválida
        mostrarCarrito();
        return;
    }
    // Si la cantidad es 0, preguntar si quiere eliminar
    if (nuevaCantidad === 0) {
        if (confirm(`¿Quieres eliminar "${carrito[index].titulo}" del carrito?`)) {
            eliminarProducto(index);
        } else {
            // Restaurar la cantidad anterior si cancela la eliminación
            mostrarCarrito();
        }
        return;
    }

    carrito[index].cantidad = nuevaCantidad;
    guardarCarrito();
    mostrarCarrito(); // Volver a renderizar el carrito para actualizar subtotales y total
}

/**
 * Elimina un producto del carrito.
 * @param {number} index - Índice del producto en el array del carrito.
 */
function eliminarProducto(index) {
    const productoTitulo = carrito[index]?.titulo || 'Producto'; // Obtener título antes de eliminar
    if (confirm(`¿Estás seguro de que deseas eliminar "${productoTitulo}" del carrito?`)) {
        carrito.splice(index, 1);
        guardarCarrito();
        mostrarCarrito(); // Volver a renderizar el carrito
        showToast(`"${productoTitulo}" eliminado del carrito.`, "info");
    }
}

/**
 * Procesa la finalización de la compra.
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        showToast("El carrito está vacío. No hay nada que comprar.", "warning");
        return;
    }

    if (confirm("¿Confirmas la compra de los artículos en tu carrito?")) {
        // Aquí podrías enviar los datos a un backend, procesar pagos, etc.
        showToast("🎉 ¡Gracias por tu compra! Tu pedido ha sido procesado.");
        carrito = []; // Vaciar el carrito
        guardarCarrito(); // Guardar el carrito vacío y actualizar contador
        mostrarCarrito(); // Actualizar la vista del carrito
    }
}

/**
 * Actualiza el número de productos en el icono del carrito en el header.
 */
function actualizarContador() {
    // Asegurarse de que contadorCarrito existe antes de intentar acceder a textContent
    if (contadorCarrito) {
        const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
        contadorCarrito.textContent = totalItems;
        // Opcional: Ocultar el contador si está en 0 para no mostrar un '0'
        contadorCarrito.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Muestra un mensaje de notificación (toast).
 * Idealmente, esto usaría una librería de notificaciones (ej. Toastr, SweetAlert2)
 * o una implementación CSS/JS simple. Aquí es un `alert` mejorado.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} type - Tipo de mensaje (info, success, warning, danger).
 */
function showToast(message, type = "success") {
    // Implementación simple con alert, podrías reemplazarla con una librería.
    const prefix = {
        success: "✅ Éxito: ",
        info: "ℹ️ Info: ",
        warning: "⚠️ Advertencia: ",
        danger: "❌ Error: "
    }[type] || "";
    alert(prefix + message);
}