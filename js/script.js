// Variables
// const mostrarDatos = document.querySelector('#mostrarDatos');
const form = document.querySelector('form');
const textemp = document.querySelector('.salida');
const input_ciudad = document.querySelector('.input_ciudad');
const parraf_temp = document.querySelector('.parraf_temp');
const body = document.querySelector('body');
const salida_datos = document.querySelector('.salida_datos');



// Eventos

window.addEventListener('DOMContentLoaded', consultarAPI("Santander"));
form.addEventListener('submit', buscarClima);

// Buscar clima
function buscarClima(e) {

    e.preventDefault();

    // Obtenemos el valor del usuario
    const input_ciudad = document.querySelector('.input_ciudad').value;
    
    // Se muestra el error, si el input se encuenta vacío
    if (input_ciudad === '') {
        // Mostrar alerta
        mostrarError('El campo no puede estar vacío');
        return;
    }

    // Consultamos la API
    consultarAPI(input_ciudad);
}


// Mostrar Alerta
function mostrarError(mensaje) {

    const alerta = document.querySelector('.error');

    if (!alerta) {
        // Crear la alerta
        const alerta = document.createElement('div');
        alerta.classList.add('alert', 'alert-danger', 'col-md-12', 'text-center', 'd-flex', 'flex-column', 'error');

        alerta.innerHTML = `<span>${mensaje}</span>`;
        form.appendChild(alerta);

        setTimeout(() => {

            alerta.remove();
        }, 4000);
    }
}


// Se obtiene API a través de la URL
function consultarAPI(ciudad) {

    const appID = '9bfd012511f0efd131b783984e0b9bbd';
    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&q=${ciudad}&appid=${appID}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            limpiarHTML(salida_datos);
            if (resultado.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }
            mostrarClima(resultado);
        })

}


// Salida HTML
function mostrarClima(resultado) {

    // Destructuring
    const {
        main: {
            feels_like,
            humidity,
            temp
        },
        name,
        sys: {
            country
        },
        weather: [{
            id,
            description,
            icon
        }],
        wind: {
            speed
        }
    } = resultado;

    //Variables 
    const tit_temp = document.createElement('div');
    const datos = document.createElement('div')
    const info_icon = document.createElement('div')
    const fecha = document.createElement('small');
    const g = document.createElement('span');
    const resultciudad = document.createElement('span');
    const descrip_icon = document.createElement('div');

    // Se asigna la clases en base a los estilos definidos por bootstrap
    tit_temp.classList.add('tit_temp', 'col-md-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'text-white');
    datos.classList.add('col-md-12', 'd-flex', 'flex-wrap', 'px-0', 'justify-content-around', 'align-items-center', 'g_ciudad');
    info_icon.classList.add('info_icon', 'info_icon');


    // Asignamos la fecha actual
    fecha.innerHTML = mostrarFecha();
    fecha.classList.add('fecha');



    g.innerHTML = `${kelvinaCentigrados(temp)}<sup>&#176</sup>`;
    g.classList.add('temp-g');

    resultciudad.innerHTML = `${name}&nbsp;<sup class='bg-primary pais'>${country}</sup>`;
    resultciudad.classList.add('ciudad');

    descrip_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt='weather icon'"/>`;
    descrip_icon.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'descrip_icon');
    descrip_icon.innerHTML += `<span class='text-center text-capitalize detalle-tiempo'>${description}</span>`;

    // En base a los elementos creados, incrustamos en el html
    salida_datos.appendChild(tit_temp);
    salida_datos.appendChild(datos);
    salida_datos.appendChild(info_icon);
    tit_temp.append(fecha);
    tit_temp.appendChild(descrip_icon);
    datos.appendChild(g);
    datos.appendChild(resultciudad);


    // <!-- Scripting -->
    info_icon.innerHTML = `
     <div class="d-flex flex-column s_termica align-items-center justify-content-center">
            <img src="./icons/s_termica.png" alt="">
            <span>${kelvinaCentigrados(feels_like)}<sup>°c</sup></span>
            <small class="text-secondary">Sensación</small> 
            <small class="text-secondary">Térmica</small>
    </div>

                    
    <div class="d-flex flex-column humedad align-items-center">
            <img src="./icons/humedad.png" alt="">
            <span >${humidity}%</span> 
            <small class="text-secondary">Humedad</small>
    </div>

    <div class="d-flex flex-column viento align-items-center">
            <img src="./icons/viento.png" alt="">
            <span >${Math.round(speed)} Km/h</span>
            <small class="text-secondary">Viento</small> 
    </div>
    `;
    // <!-- Fin Scripting -->

    body.style.background = `linear-gradient(rgba(33,37,41,0) 0%, rgba(33,37,41,0)100%),${cambiarImagen(id, icon)}`;

    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundPosition = 'center';
    body.style.backgroundSize = 'cover';

}


// Cambia la imagen en base a la respuesta( idicono ) de la API
function cambiarImagen(idicono, icon = '') {

    var bgimage = '';

    switch (true) {

        case idicono >= 200 && idicono <= 232:
            bgimage = 'url(../img/tormenta.jpg)';
            break;

        case idicono >= 300 && idicono <= 321:
            bgimage = 'url(./img/llovizna.jpg)';

        case idicono >= 500 && idicono <= 531:
            bgimage = 'url(./img/lluvia.jpg)';
            break;

        case idicono >= 600 && idicono <= 622:
            bgimage = 'url(./img/nieve.jpg)';
            break;

        case idicono >= 701 && idicono <= 781:
            bgimage = 'url(./img/atmosfera.jpg)';
            break;

        case idicono === 800 && icon === "01d":
            bgimage = 'url(./img/dia.jpg)';
            break;

        case idicono === 800 && icon === "01n":
            bgimage = 'url(./img/noche.jpg)';
            break;

        case idicono >= 801 && idicono <= 804:
            bgimage = 'url(./img/nubes.jpg)';
            break;

        default:

    }
    return bgimage;

}

function mostrarFecha() {

    const fecha = new Date();

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const nombre_mes = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
    ];
    const nro_mes = nombre_mes[fecha.getMonth()];

    nrodia = fecha.getDay() - 1;

    return `${dias[nrodia]}, ${fecha.getDate()} ${nro_mes} ${fecha.getFullYear().toString().substr(2,2)}`;
}

// Limpiar HTML
function limpiarHTML(elementopadre) {

    while (elementopadre.firstChild) {
        elementopadre.removeChild(elementopadre.firstChild);
    }
}

// Función Helper
const kelvinaCentigrados = grados => parseInt(grados - 273.15);