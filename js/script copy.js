// script.js actualizado y corregido

const contenedorProductos = document.getElementById("contenedor-productos");
const carritoContenido = document.getElementById("carrito-contenido");
const contadorCarrito = document.getElementById("contador-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualizar contador en el header
if (contadorCarrito) actualizarContador();

// Obtener productos de la API
if (contenedorProductos) {
  fetch("https://dummyjson.com/products?limit=12")
    .then((res) => res.json())
    .then((data) => mostrarProductos(data.products))
    .catch((error) => {
      contenedorProductos.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
      console.error("Error cargando productos:", error);
    });
}

// Mostrar productos como cards
function mostrarProductos(productos) {
  contenedorProductos.innerHTML = ""; // Limpiar antes de agregar
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";
    div.innerHTML = `
      <div class="card h-100">
        <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}">
        <div class="card-body">
          <h5 class="card-title">${producto.title}</h5>
          <p class="card-text">$${producto.price}</p>
          <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price})">Agregar</button>
        </div>
      </div>
    `;
    contenedorProductos.appendChild(div);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(id, titulo, precio) {
  const index = carrito.findIndex((item) => item.id === id);
  if (index !== -1) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ id, titulo, precio, cantidad: 1 });
    alert(`Producto ${titulo} agregado al carrito.`);
  }
  guardarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// Mostrar productos en carrito.html
if (carritoContenido) {
  mostrarCarrito();
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    carritoContenido.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    return;
  }

  let total = 0;
  carritoContenido.innerHTML = `
    <table class="table table-bordered">
      <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th><th>Acciones</th></tr></thead>
      <tbody>
        ${carrito.map((p, i) => {
          const subtotal = p.precio * p.cantidad;
          total += subtotal;
          return `
            <tr>
              <td>${p.titulo}</td>
              <td>$${p.precio}</td>
              <td>
                <input type="number" value="${p.cantidad}" min="1" onchange="cambiarCantidad(${i}, this.value)">
              </td>
              <td>$${subtotal}</td>
              <td><button class="btn btn-danger btn-sm" onclick="eliminarProducto(${i})">Eliminar</button></td>
            </tr>
          `;
        }).join("")}
        <tr><td colspan="3"><strong>Total:</strong></td><td colspan="2"><strong>$${total}</strong></td></tr>
      </tbody>
    </table>
    <button class="btn btn-success" onclick="finalizarCompra()">Finalizar Compra</button>
  `;
}

function cambiarCantidad(index, nuevaCantidad) {
  nuevaCantidad = parseInt(nuevaCantidad);
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
  carrito[index].cantidad = nuevaCantidad;
  guardarCarrito();
  mostrarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

function finalizarCompra() {
  alert("¡Gracias por su compra!");
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
}

function actualizarContador() {
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contadorCarrito.textContent = total;
}
