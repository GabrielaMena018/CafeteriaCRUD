const API_URL = "https://6859bd389f6ef961115417bf.mockapi.io/productos/productos";

// Obtener los datos de la API
async function ObtenerProductos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    CrearTablaProductos(data); // nombre corregido (ver nota abajo)
}

//Credencuales para guardar la imagen
const supabaseClient = 'https://api.imgbb.com/1/upload?key=b6dd0a617dee3698d775783b9230ee1a'

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




//Abrir modal
const modal = document.getElementById("modalProducto");
const btnAgregar = document.getElementById("btn-AbrirModal");

btnAgregar.addEventListener("click", () => {
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
});

//Subir imagen 
async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(supabaseClient, { method: 'POST', body: fd });
    const obj = await res.json();
    return obj.data.url;
}


//Agrgear producto
document.getElementById("productoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = (document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagenFile = document.getElementById("imagenInput").files[0];

    const imagenURL = await subirImagen(imagenFile);


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

        /*  2. Extraer el nombre del archivo desde la URL
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
        }*/

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



async function AbrirModalEditar(id, imagen, nombre, precio, categoria, descripcion) {
    console.log("Valores recibidos:", { id, imagen, nombre, precio, categoria, descripcion });
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("precioEditar").value = precio;
    document.getElementById("categoriaEditar").value = categoria;
    document.getElementById("descripcionEditar").value = descripcion;
    document.getElementById("imagenVista").src = imagen;

    // Precargar el file-input con la imagen actual
    const inputFile = document.getElementById("nuevaImagen");
    try {
        const res = await fetch(imagen);
        const blob = await res.blob();
        // Extrae el nombre de archivo de la URL
        const filename = imagen.split('/').pop().split('?')[0];
        const file = new File([blob], filename, { type: blob.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputFile.files = dataTransfer.files;

        // Si tu UI usa Bootstrap custom-file-input, actualiza la etiqueta:
        const label = document.querySelector("label[for='nuevaImagen']");
        if (label) label.textContent = filename;
    } catch (err) {
        console.warn("No se pudo precargar la imagen en el input:", err);
    }


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
    const inputFile = document.getElementById("nuevaImagen");
    const nuevaImagen = inputFile.files[0];


    let imagenFinal
    if (nuevaImagen) {
        imagenFinal = await subirImagen(nuevaImagen)
    } else {
        // no tocó el input file → mantiene la URL actual
        imagenURLfinal = document.getElementById("imagenVista").src;
    }

    // Actualizar en API 
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
            imagen: imagenFinal
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

ObtenerProductos();

