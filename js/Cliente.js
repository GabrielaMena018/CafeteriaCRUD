const  API_URL = "https://6859bd389f6ef961115417bf.mockapi.io/productos/productos";



async function ObtenerProductos(){
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const postres = data.filter(p => p.categoria == 1);
    const bebidas = data.filter(p => p.categoria == 2);

    CrearCarrusel(postres, "carouselInnerPostres");
    CrearCarrusel(bebidas, "carouselInnerBebidas");
}

const supabaseClient = 'https://api.imgbb.com/1/upload?key=b6dd0a617dee3698d775783b9230ee1a'

function CrearCarrusel(productos, contenedorID){
    const contenedor = document.getElementById(contenedorID);
    contenedor.innerHTML= "";

    const Contenedorsize = 4;
    for(let i = 0 ; i < productos.length; i += Contenedorsize){
        const grupo = productos.slice(i, i + Contenedorsize);
        const esActivo = 1 === 0 ? "Active" : "";

        let slideHTML = `<div class = "carousel-item ${esActivo}><div class="row">`;

        grupo.forEach(p => {
            slideHTML += `
           <div class="col-md-3">
              <div class="card shadow p-3">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body text-start">
                  <h5 class="card-title fw-bold">${p.nombre}</h5>
                  <p class="card-text">${p.descripcion}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold" style="color: #4d2f24;">${p.precio}</span>
                    <button class="btn px-3 py-1 rounded-pill" style="background-color: #c98e7e; color: white;">comprar</button>
                  </div>
                </div>
              </div>
            </div>`;
        });
        slideHTML += `<div></div>`
        contenedor.innerHTML += slideHTML;
    }
}


ObtenerProductos();









