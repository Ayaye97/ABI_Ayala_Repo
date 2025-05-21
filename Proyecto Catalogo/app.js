const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("busqueda");
const contenedorCategorias = document.getElementById("categorias");

let Productos = [];
let categoriasSeleccionada = "all";

//LOGICA LOGIN
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if(loginForm){
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const mensaje = document.getElementById("mensaje");
            try {
                const response = await fetch("https://fakestoreapi.com/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }

                const data = await response.json();
                localStorage.setItem("token", data.token);
                mensaje.textContent = "Inicio de sesión exitoso";
                mensaje.classList.add("text-green-500");

                setTimeout(() => {
                    window.location.href = "index.html"; // Redirigir a la página principal
                }, 1500);
                
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
                mensaje.textContent = "Error al iniciar sesión. Verifica tus credenciales.";                
                mensaje.classList.add("text-red-500");
            }
        });
    } if (contenedorProductos && contenedorCategorias && inputBusqueda) {
    // Si los elementos existen, se ejecuta la lógica de productos
    cargarProductos();
    cargarCategorias();

    //Agregar evento de búsqueda
    inputBusqueda.addEventListener("input", filtrarProductos);
    }
});

//LOGICA DE PRODUCTOS
async function cargarProductos() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const productos = await respuesta.json();

        if (productos.length === 0) {
            console.log("No hay productos disponibles.");
        } else {
            Productos = productos; // Guardar los productos en la variable global
            mostrarProductos(productos); // Mostrar los productos en la interfaz de usuario
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

async function cargarCategorias() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/categories");

        if (!respuesta.ok) {
            throw new Error("Error en la respuesta de la API");
        }

        const categorias = await respuesta.json();
        mostrarCategorias(["all", ...categorias]); // Agregar "all" como opción predeterminada
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

function filtrarProductos() {
    let filtrados = Productos;

    // Filtrar por categoría
    if (categoriasSeleccionada !== "all") {
        filtrados = filtrados.filter((p) => p.category === categoriasSeleccionada);
    }

    // Filtrar por texto de búsqueda
    const texto = inputBusqueda.value.toLowerCase();
    if (texto.trim() !== "") {
        filtrados = filtrados.filter(
            (p) =>
                p.title.toLowerCase().includes(texto) ||
                p.description.toLowerCase().includes(texto)
        );
    }

    mostrarProductos(filtrados); // Mostrar los productos filtrados
}

function mostrarCategorias(categorias) {
    contenedorCategorias.innerHTML = ""; // Limpiar el contenedor de categorías

    categorias.forEach((cat) => {
        const btn = document.createElement("button");

        btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.className = `px-4 py-2 rounded-full ${
            categoriasSeleccionada === cat
                ? "bg-blue-500 text-white" // Estilo para el botón seleccionado
                : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-white" // Estilo para hover
        } transition-colors duration-300`; // Transición suave entre colores

        btn.addEventListener("click", () => {
            categoriasSeleccionada = cat;
            mostrarCategorias(categorias); // Actualizar los estilos de los botones
            filtrarProductos(); // Filtrar los productos según la categoría seleccionada
        });

        contenedorCategorias.appendChild(btn);
    });
}

function mostrarProductos(productos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach((producto) => {
        const productoDiv = document.createElement("div");
        productoDiv.className =
            "bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300";

        productoDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
            <h3 class="text-blue-600 lg font-semibold mb-2 text-center">${producto.title}</h3>
            <p class="text-black text-center">$${producto.price}</p>
        `;
        contenedorProductos.appendChild(productoDiv);
    });
}

//Mostrar Detalle de los Prdoductos
function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = "bg-white rounded-lg shadow-md p-4 flex flex-col items-center";
        div.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-32 h-32 object-contain mb-4">
            <h3 class="text-blue-700 font-semibold mb-2 text-center">${producto.title}</h3>
            <p class="text-black text-center mb-2">$${producto.price}</p>
            <button onclick="window.location.href='detalle.html?id=${producto.id}'"
                class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Detalles
            </button>
        `;
        contenedor.appendChild(div);
    });
}

//Detalle de los Productos.
if (window.location.pathname.endsWith('detalle.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const contenedor = document.getElementById('detalleProducto');
    if (!id) {
        contenedor.innerHTML = '<p>No se encontró el producto.</p>';
    } else {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(producto => {
                contenedor.innerHTML = `
                    <img src="${producto.image}" alt="${producto.title}" class="w-48 h-48 object-contain mx-auto mb-4">
                    <h2 class="text-2xl font-bold mb-2">${producto.title}</h2>
                    <p class="text-xl text-blue-700 font-semibold mb-2">$${producto.price}</p>
                    <p class="mb-2"><span class="font-bold">Categoría:</span> ${producto.category}</p>
                    <p class="mb-4">${producto.description}</p>
                    <a href="Tienda.html" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Volver</a>
                `;
            })
            .catch(() => {
                contenedor.innerHTML = '<p>Error al cargar el producto.</p>';
            });
    }
}

inputBusqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Cargar los productos al cargar la página
    cargarCategorias(); // Cargar las categorías al cargar la página
});