const API_URL = "https://6859bd389f6ef961115417bf.mockapi.io/productos/productos";

const supabaseClient = 'https://api.imgbb.com/1/upload?key=b6dd0a617dee3698d775783b9230ee1a';

async function ObtenerProductos() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const postres = data.filter(p => p.categoria == 1);
  const bebidas = data.filter(p => p.categoria == 2);

  console.log(data)
  CrearCarrusel(postres, "carouselInnerPostres");
  CrearCarrusel(bebidas, "carouselInnerBebidas");
}



function CrearCarrusel(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  contenedor.innerHTML = "";


  const Contenedorsize = 4;
  for (let i = 0; i < productos.length; i += Contenedorsize) {
    const grupo = productos.slice(i, i + Contenedorsize);
    const esActivo = i === 0 ? "active" : "";

    let slideHTML = `<div class = "carousel-item ${esActivo}"><div class="row">`;

    grupo.forEach(p => {
      slideHTML += `
           <div class="col-md-3 py-5">
              <div class="card h-100 shadow p-3">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body text-start">
                  <h5 class="card-title fw-bold">${p.nombre}</h5>
                  <p class="card-text">${p.descripcion}</p>
                  <div class="d-flex justify-content-between align-items-center mt-5">
                    <span class="fw-bold" style="color: #4d2f24;">$${p.precio}</span>
                    <button class="btn px-3 py-1 rounded-pill" style="background-color: #c98e7e; color: white;">comprar</button>
                  </div>
                </div>
              </div>
            </div>`;
    });
    slideHTML += `</div></div>`
    contenedor.innerHTML += slideHTML;
    console.log(contenedor)
  }
}


ObtenerProductos();









