const contenedorProductos = document.getElementById("productos");
const inputBusqueda = document.getElementById("busqueda");
const contenedorCategorias = document.getElementById("categorias");

let Productos = [];
let categoriasSeleccionada = "all";

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

inputBusqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    cargarCategorias(); // Cargar las categorías al cargar la página
});