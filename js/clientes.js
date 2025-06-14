const API_URL = "https://retoolapi.dev/QWJAau/productos";

//Credencuales ara guardar la imagen
const supabaseClient = supabase.createClient(
    'https://kidqmjghdrtbergdubkp.supabase.co', // project URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZHFtamdoZHJ0YmVyZ2R1YmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTQyMDUsImV4cCI6MjA2NTM5MDIwNX0.e20sTa_-qYEqUpjpImdepHXhUh0Sh40aTcHnQoSd3-o' // public API key
);

async function ObtenerProductos() {
    const res = await fetch(API_URL);
    const data = await res.json();

    const postres = data.filter(p => p.categoria == 1);
    const bebidas = data.filter(p => p.categoria == 2);

    crearCarrusel(postres, "carouselInnerPostres");
    crearCarrusel(bebidas, "carouselInnerBebidas");
}

function crearCarrusel(productos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = "";

    const chunkSize = 4;
    for (let i = 0; i < productos.length; i += chunkSize) {
        const grupo = productos.slice(i, i + chunkSize);
        const esActivo = i === 0 ? "active" : "";

        let slideHTML = `<div class="carousel-item ${esActivo}"><div class="row">`;

        grupo.forEach(p => {
            slideHTML += `
            <div class="col-md-3">
              <div class="card shadow p-3">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body text-start">
                  <h5 class="card-title fw-bold">${p.nombre}</h5>
                  <p class="card-text">${p.descripcion}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold" style="color: #4d2f24;">$${p.precio}</span>
                    <button class="btn px-3 py-1 rounded-pill" style="background-color: #c98e7e; color: white;">comprar</button>
                  </div>
                </div>
              </div>
            </div>`;
        });

        slideHTML += `</div></div>`;
        contenedor.innerHTML += slideHTML;
    }
}

ObtenerProductos();
