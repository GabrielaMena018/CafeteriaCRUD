const API_URL = "https://retoolapi.dev/QWJAau/productos";

// Obtener los datos de la API
async function ObtenerProductos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    CrearTablaProductos(data); // nombre corregido (ver nota abajo)
}

//Credencuales ara guardar la imagen
const supabaseClient = supabase.createClient(
    'https://kidqmjghdrtbergdubkp.supabase.co', // project URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZHFtamdoZHJ0YmVyZ2R1YmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTQyMDUsImV4cCI6MjA2NTM5MDIwNX0.e20sTa_-qYEqUpjpImdepHXhUh0Sh40aTcHnQoSd3-o' // public API key
);

//Crear tabla de productos
function CrearTablaProductos(datos) {
    const contenedor = document.getElementById("tablaProductos");

    let tabla = `
    <thead class="table-light">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Categoría</th>
        <th>Producto</th>
        <th>Opciones</th>
      </tr>
    </thead>
    <tbody class="bg-postres">
  `;

    datos.forEach(productos => {
        const categoriaTexto = productos.categoria == 1 ? "Postre" : "Bebida";

        tabla += `
      <tr>
        <td>${productos.id}</td>
        <td>${productos.nombre}</td>
        <td>${productos.descripcion}</td>
        <td>$${productos.precio}</td>
        <td>${categoriaTexto}</td>
        <td>
          <img  src="${productos.imagen}" alt="${productos.nombre}" style="max-width: 100px; border-radius: 10px;">
        </td>
        <td>
          <button class="btn btn-editar rounded-pill me-2"  data-id="${productos.id}"
            data-imagen="${productos.imagen}"
            data-nombre="${productos.nombre}"
            data-precio="${productos.precio}"
            data-categoria="${productos.categoria}"
            data-descripcion="${productos.descripcion}">
            Editar
        </button>
          <button class="btn btn-eliminar rounded-pill" onclick="eliminarProducto('${productos.id}')">Eliminar</button>
        </td>
      </tr>
    `;
    });

    tabla += `</tbody>`;
    contenedor.innerHTML = tabla;
}


/*function CrearTarjeta(datos) {


    const contenedorPostres = document.getElementById("tarjetasPostre");
    const contenedorBebida = document.getElementById("tarjetasBebida");
    contenedorBebida.innerHTML = ""; // limpia el contenedor
    contenedorPostres.innerHTML = "";

    datos.forEach(productos => {
        const tarjeta = `
      <div class="col-md-3">
        <div class="card shadow p-3">
          <img src="${productos.imagen}" class="card-img-top" alt="${productos.nombre}">
          <div class="card-body text-start">
            <h5 class="card-title fw-bold">${productos.nombre}</h5>
            <p class="card-text">${productos.descripcion}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold" style="color: #4d2f24;">$${productos.precio}</span>
            </div>
            <div class="Controles px-5 mt-4">
              <button class="btn btn-editar rounded-pill mr-2" onclick="editarProducto('${productos.id}')">Editar</button>
              <button class="btn btn-eliminar rounded-pill" onclick="eliminarProducto('${productos.id}')">Eliminar</button>
            </div>
          </div>
        </div>
      </div>`;

        if (productos.categoria == 1) {
            contenedorPostres.innerHTML += tarjeta;
        } else if (productos.categoria == 2) {
            contenedorBebida.innerHTML += tarjeta;
        }
    });
};*/


//Abrir modal
const modal = document.getElementById("modalProducto");
const btnAgregar = document.getElementById("btn-AbrirModal");

btnAgregar.addEventListener("click", () => {
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
});

//Agrgear producto
document.getElementById("productoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = (document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagenFile = document.getElementById("imagenInput").files[0];

    if (!imagenFile) {
        alert("Selecciona una imagen");
    }

    const nombreUnico = `${Date.now()}-${imagenFile.name}`;

    const { data, error } = await supabaseClient
        .storage
        .from('imagenes') // nombre del bucket
        .upload(nombreUnico, imagenFile);

    if (error) {
        console.error("Error al subir imagen:", error);
        return;
    }

    // Obtener la URL pública
    const { data: publicURLData } = supabaseClient
        .storage
        .from('imagenes')
        .getPublicUrl(nombreUnico);

    const imagenURL = publicURLData.publicUrl;
    console.log("Imagen subida:", imagenURL);


    const reader = new FileReader();
    reader.onloadend = async function () {

        if (categoria == "postre") {
            console.log("Categoria postre");
            const categoriaPostre = 1;
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio,
                    imagen: imagenURL,
                    categoria: categoriaPostre
                })
            });

            const data = await res.json();
            console.log(data);
            alert("Producto guardado correctamente 🎉");

            ObtenerProductos();
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } else if (categoria == "bebida") {
            console.log("Categoria bebida");
            const categoriaBebida = 2;
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio,
                    imagen: imagenURL,
                    categoria: categoriaBebida
                })
            });

            const data = await res.json();
            console.log(data);
            alert("Producto guardado correctamente 🎉");

            ObtenerProductos();
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } else {
            alert("Elija una categoria");
        }
        // Enviar al endpoint de tu API de Retool


    };

    reader.readAsDataURL(imagenFile);
});


//Eliminar productos
async function eliminarProducto(id) {
    if (confirm("¿Está seguro de eliminar este producto?")) {
        // 1. Obtener el producto desde Retool API
        const res = await fetch(`${API_URL}/${id}`);
        const producto = await res.json();
        const imagenUrl = producto.imagen;

        // 2. Extraer el nombre del archivo desde la URL
        const partesUrl = imagenUrl.split('/');
        const nombreArchivo = partesUrl[partesUrl.length - 1]; // último segmento

        // 3. Eliminar imagen de Supabase
        const { error } = await supabaseClient
            .storage
            .from('imagenes') // nombre del bucket
            .remove([nombreArchivo]);

        if (error) {
            console.error("Error al eliminar imagen de Supabase:", error);
            alert("Hubo un error al eliminar la imagen.");
            return;
        }

        const deleteRes = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (deleteRes.ok) {
            alert("Producto eliminado correctamente 🎉");
            ObtenerProductos(); // vuelve a cargar la lista
        } else {
            alert("No se pudo eliminar el producto");
        }
        ObtenerProductos();
    }
}

ObtenerProductos();

// Suponiendo que ya insertaste el innerHTML de la tarjeta
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-editar")) {
    const btn = e.target;
    const id = btn.dataset.id;
    const imagen = btn.dataset.imagen;
    const nombre = btn.dataset.nombre;
    const precio = btn.dataset.precio;
    const categoria = btn.dataset.categoria;
    const descripcion = btn.dataset.descripcion;

    AbrirModalEditar(id, imagen, nombre, precio, categoria, descripcion);
  }
});



function AbrirModalEditar(id, imagen, nombre, precio, categoria, descripcion) {
    console.log("Valores recibidos:", { id, imagen, nombre, precio, categoria, descripcion });
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("precioEditar").value = precio;
    document.getElementById("categoriaEditar").value = categoria;
    document.getElementById("descripcionEditar").value = descripcion;
    document.getElementById("imagenVista").src = imagen;

    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

document.getElementById("formEditarProducto").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value;
    const descripcion = document.getElementById("descripcionEditar").value;
    const precio = document.getElementById("precioEditar").value;
    const categoria = document.getElementById("categoriaEditar").value;
    const nuevaImagen = document.getElementById("nuevaImagen").files[0];
    const imagenActual = document.getElementById("imagenVista").src;

    let nuevaURL = imagenActual;

    if (nuevaImagen) {
        try {
            // 1. Eliminar imagen anterior
            const nombreArchivoViejo = imagenActual.split('/').pop().split('?')[0]; // obtén el nombre del archivo
            await supabaseClient.storage.from('imagenes').remove([nombreArchivoViejo]);

            // 2. Subir nueva imagen
            const nombreUnico = `${Date.now()}-${nuevaImagen.name}`;
            const { data, error } = await supabaseClient.storage
                .from('imagenes')
                .upload(nombreUnico, nuevaImagen);

            if (error) throw error;

            // 3. Obtener URL pública
            const { data: publicData } = supabaseClient
                .storage
                .from('imagenes')
                .getPublicUrl(nombreUnico);

            nuevaURL = publicData.publicUrl;
        } catch (err) {
            console.error("Error al manejar la imagen:", err);
            alert("Hubo un problema con la imagen");
            return;
        }
    }

    // Actualizar en tu API Retool
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria,
            imagen: nuevaURL
        })
    });

    if (res.ok) {
        alert("Producto actualizado correctamente 🎉");
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditar"));
        modal.hide();
        ObtenerProductos(); // refresca la tabla o las tarjetas
    } else {
        alert("Error al actualizar producto");
    }
});

