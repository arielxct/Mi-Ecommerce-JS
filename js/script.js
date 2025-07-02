// --- Selectores del DOM ---
const contenedorProductos = document.getElementById("contenedor-productos");
const carritoContenido = document.getElementById("carrito-contenido");
const contadorCarrito = document.getElementById("contador-carrito");
const botonFinalizarCompra = document.getElementById("finalizar-compra-btn");

// --- Estado Global del Carrito ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- Inicialización al cargar el DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el contador del carrito en el header si existe el elemento.
    if (contadorCarrito) {
        actualizarContador();
    }

    // Cargar y mostrar productos en la página principal si existe el contenedor.
    if (contenedorProductos) {
        fetchProducts();
    }

    // Mostrar el contenido del carrito en la página del carrito si existe el contenedor.
    if (carritoContenido) {
        renderizarCarrito(); // Cambié el nombre a renderizarCarrito
        // Asignar evento al botón de finalizar compra si existe.
        if (botonFinalizarCompra) {
            botonFinalizarCompra.addEventListener('click', finalizarCompra);
        }
    }
});

// --- Funciones de Lógica de Negocio y Renderizado ---

/**
 * Obtiene los productos de la API y los muestra en el contenedor.
 */
async function fetchProducts() {
    if (!contenedorProductos) return; // Asegurarse de que el elemento exista

    try {
        const response = await fetch("https://dummyjson.com/products?limit=12");
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        mostrarProductos(data.products);
    } catch (error) {
        console.error("Error cargando productos:", error);
        contenedorProductos.innerHTML = `
            <div class="col-12 text-center text-danger">
                <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                <p>Lo sentimos, no pudimos cargar los productos en este momento.</p>
                <p>Por favor, inténtelo de nuevo más tarde o contacte a soporte.</p>
            </div>
        `;
    }
}

/**
 * Renderiza los productos obtenidos de la API en el DOM como tarjetas.
 * @param {Array<Object>} productos - Array de objetos producto.
 */
function mostrarProductos(productos) {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = ""; // Limpiar antes de agregar nuevos productos

    if (productos.length === 0) {
        contenedorProductos.innerHTML = "<p class='text-center text-muted'>No hay productos disponibles en este momento.</p>";
        return;
    }

    productos.forEach((producto) => {
        const div = document.createElement("div");
        // Columnas responsivas: 12 en extra-small, 6 en small, 4 en medium y large.
        div.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4"; // Añadido col-lg-3 para desktops más grandes
        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${producto.thumbnail}" class="card-img-top img-fluid" alt="${producto.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-truncate" title="${producto.title}">${producto.title}</h5>
                    <p class="card-text fw-bold">$${producto.price.toFixed(2)}</p>
                    <button class="btn btn-primary w-100 mt-auto agregar-btn" 
                            data-id="${producto.id}" 
                            data-title="${producto.title}" 
                            data-price="${producto.price}"
                            aria-label="Agregar ${producto.title} al carrito">
                        <i class="fas fa-cart-plus me-2"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(div);
    });

    // Asignar event listeners a los botones de "Agregar al Carrito"
    document.querySelectorAll('.agregar-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const { id, title, price } = event.target.dataset;
            agregarAlCarrito(parseInt(id), title, parseFloat(price));
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
        showToast(`Cantidad de "${titulo}" actualizada en el carrito.`, "info");
    } else {
        carrito.push({ id, titulo, precio, cantidad: 1 });
        showToast(`"${titulo}" agregado al carrito.`, "success");
    }
    guardarCarrito(); // Guardar y actualizar contador
}

/**
 * Guarda el estado actual del carrito en localStorage y actualiza el contador.
 */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (contadorCarrito) {
        actualizarContador();
    }
}

/**
 * Renderiza el contenido del carrito en la página del carrito.
 */
function renderizarCarrito() {
    if (!carritoContenido) return;

    if (carrito.length === 0) {
        carritoContenido.innerHTML = `
            <p class='text-center text-muted fs-5'>
                <i class="fas fa-shopping-basket fa-3x mb-3 d-block"></i>
                Tu carrito está vacío. ¡Explora nuestros productos y agrega algo!
            </p>
        `;
        // Deshabilitar botón de finalizar compra si el carrito está vacío
        if (botonFinalizarCompra) {
            botonFinalizarCompra.disabled = true;
            botonFinalizarCompra.classList.add('btn-secondary');
            botonFinalizarCompra.classList.remove('btn-success');
        }
        return;
    }

    // Habilitar botón de finalizar compra si hay productos
    if (botonFinalizarCompra) {
        botonFinalizarCompra.disabled = false;
        botonFinalizarCompra.classList.remove('btn-secondary');
        botonFinalizarCompra.classList.add('btn-success');
    }

    let totalGlobal = 0;

    const tablaHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${carrito.map((producto, index) => {
                        const subtotal = producto.precio * producto.cantidad;
                        totalGlobal += subtotal;
                        return `
                            <tr>
                                <td class="d-flex align-items-center">
                                    <img src="${producto.thumbnail}" alt="${producto.titulo}" class="img-thumbnail me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                    <span>${producto.titulo}</span>
                                </td>
                                <td>$${producto.precio.toFixed(2)}</td>
                                <td>
                                    <input type="number" 
                                           value="${producto.cantidad}" 
                                           min="1" 
                                           data-index="${index}" 
                                           class="form-control form-control-sm cantidad-input"
                                           style="width: 70px;"
                                           aria-label="Cantidad de ${producto.titulo}">
                                </td>
                                <td>$${subtotal.toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm eliminar-btn" 
                                            data-index="${index}" 
                                            aria-label="Eliminar ${producto.titulo}">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                    <tr class="table-info">
                        <td colspan="3" class="text-end fw-bold">Total del Carrito:</td>
                        <td colspan="2" class="fw-bold fs-5">$${totalGlobal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    carritoContenido.innerHTML = tablaHTML;

    // Asignar event listeners a los inputs de cantidad y botones de eliminar
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
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        showToast("La cantidad debe ser un número positivo.", "warning");
        renderizarCarrito(); // Restaurar la cantidad anterior si la entrada es inválida
        return;
    }
    if (nuevaCantidad === 0) {
        if (confirm(`¿Quieres eliminar "${carrito[index].titulo}" del carrito?`)) {
            eliminarProducto(index);
        } else {
            renderizarCarrito(); // Restaurar la cantidad anterior si cancela la eliminación
        }
        return;
    }

    carrito[index].cantidad = nuevaCantidad;
    guardarCarrito();
    renderizarCarrito();
}

/**
 * Elimina un producto del carrito.
 * @param {number} index - Índice del producto en el array del carrito.
 */
function eliminarProducto(index) {
    const productoTitulo = carrito[index]?.titulo || 'Producto';
    if (confirm(`¿Estás seguro de que deseas eliminar "${productoTitulo}" del carrito?`)) {
        carrito.splice(index, 1);
        guardarCarrito();
        renderizarCarrito();
        showToast(`"${productoTitulo}" eliminado del carrito.`, "info");
    }
}

/**
 * Procesa la finalización de la compra. Redirige a la página de pago.
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        showToast("El carrito está vacío. No hay nada que comprar.", "warning");
        return;
    }
    // Redirigir a la página de pago. La lógica de vaciar el carrito se hará en pago.html
    window.location.href = "pago.html";
}

/**
 * Actualiza el número de productos en el icono del carrito en el header.
 */
function actualizarContador() {
    if (contadorCarrito) {
        const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
        contadorCarrito.textContent = totalItems;
        contadorCarrito.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Muestra un mensaje de notificación (toast simulado con alert).
 * @param {string} message - Mensaje a mostrar.
 * @param {string} type - Tipo de mensaje (info, success, warning, danger).
 */
function showToast(message, type = "info") {
    const prefix = {
        success: "✅ Éxito: ",
        info: "ℹ️ Info: ",
        warning: "⚠️ Advertencia: ",
        danger: "❌ Error: "
    }[type] || "";
    alert(prefix + message);
}