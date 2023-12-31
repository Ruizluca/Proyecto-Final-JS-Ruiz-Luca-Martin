// Clase "molde" para los productos de mi pagina
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
      this.imagen = imagen;
    }
  }
  
  // Clase para que simula la base de datos del e-commerce, acá van a estar
  // Todos los productos del catálogo
  class BaseDeDatos {
    constructor() {
      // Array para el catálogo
      this.productos = [];
      // Se empieza a cargar productos
      this.agregarRegistro(1, "Buzo", 5000, "Alimentos", "../imagenes/buzo.jpg");
      this.agregarRegistro(
        2,
        "Remera",
        3000,
        "Alimentos",
        "../imagenes/remera.jpg"
      );
      this.agregarRegistro(
        3,
        "Gorra",
        3500,
        "Alimentos",
        "../imagenes/gorra.webp"
      );
      this.agregarRegistro(
        4,
        "Zapatillas",
        30000,
        "Alimentos",
        "../imagenes/zapatillas.webp"
      );
    }
  
    // Método que crea el objeto producto y lo almacena en el catálogo (array)
    agregarRegistro(id, nombre, precio, categoria, imagen) {
      const producto = new Producto(id, nombre, precio, categoria, imagen);
      this.productos.push(producto);
    }
  
    // Aca devuelve todo el catálogo de productos
    traerRegistros() {
      return this.productos;
    }
  
    // Aca devuelve un producto según el ID
    registroPorId(id) {
      return this.productos.find((producto) => producto.id === id);
    }
  
    // Aca devuelve un array con todas las coincidencias que encuentre según el
    // Nombre del producto con la palabra que el pasemos como parámetro
    registrosPorNombre(palabra) {
      return this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(palabra.toLowerCase())
      );
    }
  }
  
  // Clase carrito que nos sirve para manipular los productos de nuestro carrito
  class Carrito {
    constructor() {
      // Storage
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      // Array donde van a estar almacenados todos los productos del carrito
      this.carrito = carritoStorage || [];
      this.total = 0; // Suma total de los precios de todos los productos
      this.cantidadProductos = 0; // La cantidad de productos que tenemos en el carrito
      // Llamo a listar apenas de instancia el carrito para aplicar lo que
      // hay en el storage (en caso de que haya algo)
      this.listar();
    }
  
    // Método para saber si el producto ya se encuentra en el carrito
    estaEnCarrito({ id }) {
      return this.carrito.find((producto) => producto.id === id);
    }
  
    // Agregar al carrito
    agregar(producto) {
      const productoEnCarrito = this.estaEnCarrito(producto);
      // Si no está en el carrito, le mando eun push y le agrego
      // la propiedad "cantidad"
      if (!productoEnCarrito) {
        this.carrito.push({ ...producto, cantidad: 1 });
      } else {
        // De lo contrario, si ya está en el carrito, le sumo en 1 la cantidad
        productoEnCarrito.cantidad++;
      }
      // Actualizo el storage
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      // Muestro los productos en el HTML
      this.listar();
    }
  
    // Quitar del carrito
    quitar(id) {
      // Obtengo el índice de un producto según el ID, porque el
      // método splice requiere el índice
      const indice = this.carrito.findIndex((producto) => producto.id === id);
      // Si la cantidad es mayor a 1, le resto la cantidad en 1
      if (this.carrito[indice].cantidad > 1) {
        this.carrito[indice].cantidad--;
      } else {
        // Y sino, borramos del carrito el producto a quitar
        this.carrito.splice(indice, 1);
      }
      // Actualizo el storage
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      // Muestro los productos en el HTML
      this.listar();
    }
  
    // Renderiza todos los productos en el HTML
    listar() {
      // Se reinician las variables
      this.total = 0;
      this.cantidadProductos = 0;
      divCarrito.innerHTML = "";
      // Recorro producto por producto del carrito, y los dibujo en el HTML
      for (const producto of this.carrito) {
        divCarrito.innerHTML += `
            <div class="productoCarrito">
              <h2>${producto.nombre}</h2>
              <p>$${producto.precio}</p>
              <p>Cantidad: ${producto.cantidad}</p>
              <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
            </div>
          `;
        // Se actualizan los totales
        this.total += producto.precio * producto.cantidad;
        this.cantidadProductos += producto.cantidad;
      }
      // Como no se cuantos productos tengo en el carrito, debo
      // asignarle los eventos de forma dinámica a cada uno
      // Primero hago una lista de todos los botones con .querySelectorAll
      const botonesQuitar = document.querySelectorAll(".btnQuitar");
      // Después los recorro uno por uno y les asigno el evento a cada uno
      for (const boton of botonesQuitar) {
        boton.addEventListener("click", (event) => {
          event.preventDefault();
          // Obtengo el id por el dataset (está asignado en this.listar())
          const idProducto = Number(boton.dataset.id);
          // Llamo al método quitar pasándole el ID del producto
          this.quitar(idProducto);
        });
      }
      // Actualizo los contadores del HTML
      spanCantidadProductos.innerText = this.cantidadProductos;
      spanTotalCarrito.innerText = this.total;
    }
  }
  
  // Aca se inicia la base de datos
  const bd = new BaseDeDatos();
  
  // Elementos
  const spanCantidadProductos = document.querySelector("#cantidadProductos");
  const spanTotalCarrito = document.querySelector("#totalCarrito");
  const divProductos = document.querySelector("#productos");
  const divCarrito = document.querySelector("#carrito");
  const inputBuscar = document.querySelector("#inputBuscar");
  const botonCarrito = document.querySelector("section h1");
  
  // Aca se inicia la clase Carrito
  const carrito = new Carrito();
  
  // Aca se muestra el catálogo de la base de datos apenas carga la página
  cargarProductos(bd.traerRegistros());
  
  // Función para mostrar para renderizar productos del catálogo o buscador
  function cargarProductos(productos) {
    // Vacío el div
    divProductos.innerHTML = "";
    // Recorro producto por producto y lo dibujamos en el HTML
    for (const producto of productos) {
      divProductos.innerHTML += `
          <div class="producto">
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio}</p>
            <div class="imagen">
              <img src="${producto.imagen}" />
            </div>
            <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
          </div>
        `;
    }
  
    // Lista dinámica con todos los botones que haya en nuestro catálogo
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
  
    // Recorro botón por botón de cada producto en el catálogo y le agregamos
    // el evento click a cada uno
    for (const boton of botonesAgregar) {
      boton.addEventListener("click", (event) => {
        // Evita el comportamiento default de HTML
        event.preventDefault();
        // Guardo el dataset ID que está en el HTML del botón Agregar al carrito
        const idProducto = Number(boton.dataset.id);
        // Uso el método de la base de datos para ubicar el producto según el ID
        const producto = bd.registroPorId(idProducto);
        // Llama al método agregar del carrito
        carrito.agregar(producto);
      });
    }
  }
  
  // Buscador
  inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
  });
  
  // Toggle para ocultar/mostrar el carrito
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  });