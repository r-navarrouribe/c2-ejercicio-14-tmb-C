/* eslint-disable no-loop-func */
/* global mapboxgl */

// api localizaar zona mediante texto y transformarla a lnglat
let localidadOrigen = "barcelona";
let localidadDestino;

const coordenadas = {
  desde: {
    latitud: 41.42252,
    longitud: 2.187824,
  },
  hasta: {
    latitud: 41.42252,
    longitud: 2.197824,
  },
};

const mapboxToken =
  "pk.eyJ1IjoiemlpbmlrIiwiYSI6ImNrcGk3c3UxZzAwNmQycHAwZTk0YjhpemUifQ.TfQ7tlPczVzbIefuWdtPtA";
let geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${localidadOrigen}.json?&access_token=${mapboxToken}`;

// ruta con coordenades desde origen hasta destino y itinerario de como llegar y tempo empleado

const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "ba67b92e";
const appKey = "d65b2261fc0be12f06f831fc8334fe5a";
const fromPlace = [];
const toPlace = [];

/* patron que he seguido : primero creo una funcion llamada planning que recogue el planning, despues extraemos los datos etc recogidos en nuevaRuta,
dentro creo una funcion nueva que recoge los datos del mapbox (quizas tengamos que invertirlas) extraigo los datos de coordenadas y lo introducimos en el mapa a la vez que lo generamos en  */

const elementoListaPasos = document.querySelector(".pasos");
const iniciar = document.querySelector(".enviar");
const inputTextElementos = document.querySelectorAll(".direccion-definitiva");
const grupoElemento = document.querySelectorAll(".coordenadas");
const indicarUbicacion = document.querySelectorAll(
  ".introducirUbicacion input"
);
const nombreLugar = document.querySelectorAll(".nombre-lugar");
grupoElemento.forEach((elemento, On) => {
  console.log(elemento, On);
  elemento.addEventListener("input", (e) => {
    const lugar = On === 0 ? coordenadas.desde : coordenadas.hasta;
    console.log(lugar);
    if (e.target.value === "origen") {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      const error = (error) => {
        console.warn(`ERROR(${error.code}): ${error.message}`);
      };
      const obtenerPosicionActual = (posicion) => {
        const { coords } = posicion;

        lugar.longitud = coords.longitude;
        lugar.latitud = coords.latitude;
        console.log(coordenadas);
      };
      navigator.geolocation.getCurrentPosition(
        obtenerPosicionActual,
        error,
        options
      );
    } else {
      inputTextElementos[On].addEventListener("input", (e) => {
        console.log(e.target.value);

        if (On === 0) {
          geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?&access_token=${mapboxToken}`;
          const datosUbicacion = fetch(geocodingApi)
            .then((dato) => dato.json())
            .then((datos) => arrayUbicacion(datos.features[0]));
          const arrayUbicacion = (coordenadas) => {
            const [latitud, longitud] = coordenadas.geometry.coordinates;
            lugar.longitud = latitud;
            lugar.latitud = longitud;
            nombreLugar[On].textContent = coordenadas.place_name;
          };
          localidadOrigen = e.target.value.replaceAll(" ", "+");
        } else {
          geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?&access_token=${mapboxToken}`;
          const datosUbicacion = fetch(geocodingApi)
            .then((dato) => dato.json())
            .then((datos) => arrayUbicacion(datos.features[0]));

          const arrayUbicacion = (coordenadas) => {
            const [latitud, longitud] = coordenadas.geometry.coordinates;
            lugar.longitud = latitud;
            lugar.latitud = longitud;
            nombreLugar[On].textContent = coordenadas.place_name;
          };

          localidadDestino = e.target.value.replaceAll(" ", "+");
        }
      });

      console.log(localidadOrigen);
    }
    if (indicarUbicacion[On].checked) {
      console.log(e);
      inputTextElementos[On].classList.add("on");
    } else {
      inputTextElementos[On].classList.remove("on");
    }
  });
  console.log(coordenadas);
});

const vaciarPasos = () => {
  for (const elementoPaso of elementoListaPasos.querySelectorAll(
    ".nuevo-paso"
  )) {
    elementoPaso.remove();
  }
};

const submitEnviar = document.querySelector(".form-coordenadas");
submitEnviar.addEventListener("submit", (e) => {
  e.preventDefault();
  const metropolitano = fetch(
    // llamada a la api tmb
    `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=${coordenadas.desde.latitud},${coordenadas.desde.longitud}&toPlace=${coordenadas.hasta.latitud},${coordenadas.hasta.longitud}&date=06/06/2021&time=11:58am&arriveBy=11:58am&mode=WALK,BUS,SUBWAY`
  )
    .then((dato) => dato.json())
    .then((datos) => planning(datos.plan));

  // Declaración de elementos para la iteración de los pasos

  const planning = (datos) => {
    const nuevaRuta = { ...datos }; // creacion del objeto planning

    console.log(nuevaRuta);

    // captacion de las coordenadas introducidas en mapbox
    const datosMapa = fetch(geocodingApi)
      .then((dato) => dato.json())
      .then((datos) =>
        arrayCoordenadas(datos.features[0].geometry.coordinates)
      ); // aqui cojo la primera coordenada de la array pero hay muchas mas, queda por ver /se podria hacer un bucle con datos.features y ver que podemos usar

    mapboxgl.accessToken = mapboxToken; // llamada a la api con su token

    const textodeDireccion = document.querySelector(".de-direccion-definitiva");
    const deDireccion = document.querySelector("#de-direccion");
    deDireccion.addEventListener("checked", (e) => {
      if (e.target.value === "deDireccion") {
        textodeDireccion.classList.add("on");
      } else {
        textodeDireccion.classList.remove("on");
      }
    });

    const arrayCoordenadas = (array) => {
      const coordenadasBarcelona = array; // aqui sacamos las coordenadas del fetch
      console.log(coordenadasBarcelona);

      // Declaración array de pasos

      const listadoPasos = datos.itineraries[0].legs;

      vaciarPasos();

      // Iteración de los pasos
      let i = 1;
      for (const paso of listadoPasos) {
        const {
          distance,
          duration,
          startTime,
          from: { name: desde, lon, lat },
          to: { name: hasta },
        } = paso;

        // Clonación del dummy
        const nuevoPaso = document.querySelector(".paso-dummy").cloneNode(true);
        nuevoPaso.classList.remove("paso-dummy");
        nuevoPaso.classList.add("nuevo-paso");

        // Mapa de cada paso

        const mapa = nuevoPaso.querySelector(".mapa");
        // LLama a esta función para generar el pequeño mapa que sale en cada paso
        // Le tienes que pasar un array con las dos coordenadas y el elemento HTML donde tiene que generar el mapa
        const generaMapa = (coordenadas, mapa) => {
          const mapbox = new mapboxgl.Map({
            container: mapa, // clase donde se pondra el mapa
            style: "mapbox://styles/mapbox/streets-v11",
            center: coordenadas, // solo las dos coordenadas donde se fijara el mapa al iniciarse
            zoom: 18,
          });

          const marcador = new mapboxgl.Marker()
            .setLngLat(coordenadas)
            .addTo(mapbox); // marcador para ubicarnos bien en el mapa
        };
        const arrayCoordenadasOrigen = [lon, lat];

        console.log(arrayCoordenadasOrigen);

        generaMapa(arrayCoordenadasOrigen, mapa);

        // Encabezado
        const encabezadoPaso = nuevoPaso.querySelector(".paso-encabezado");
        const numeroPaso = nuevoPaso.querySelector(".paso-numero");
        numeroPaso.textContent = `Paso ${i++}: `;
        const origenPaso = nuevoPaso.querySelector(".paso-from");
        origenPaso.textContent = `De ${desde} `;
        const destinoPaso = nuevoPaso.querySelector(".paso-to");
        destinoPaso.textContent = `a ${hasta}`;

        // Hora, distancia y duración
        const horaInicio = new Date(startTime);
        const minutos = horaInicio.getMinutes();
        const insertarMinutos = (minutos) => {
          if (minutos < 10) {
            return `0${minutos}`;
          } else {
            return minutos;
          }
        };
        const horaPaso = nuevoPaso.querySelector(".paso-hora");
        horaPaso.textContent = `Hora: ${horaInicio.getHours()}:${insertarMinutos(
          minutos
        )}`;

        const distanciaPaso = nuevoPaso.querySelector(".paso-distancia");
        distanciaPaso.textContent = `Distancia: ${Math.round(distance)}m`;

        const duracionPaso = nuevoPaso.querySelector(".paso-duracion");
        duracionPaso.textContent = `Duración: ${(duration / 3600).toFixed(2)}h`;

        // Emoji
        if (paso.mode === "WALK") {
          nuevoPaso.classList.add("walk");
        } else if (paso.mode === "SUBWAY") {
          nuevoPaso.classList.add("subway");
        } else if (paso.mode === "BUS") {
          nuevoPaso.classList.add("bus");
        }

        // Inserción del paso
        elementoListaPasos.append(nuevoPaso);
      }

      console.log(listadoPasos);

      // generamos un mapa con las coordenadas que queremos, tendremos que cambiarlo a la hora de poner el bucle segun si es current location o location buscada

      // Coordenadas que se mandarán a la API de TMB. Tienes que alimentar este objeto a partir de las coordenadas que te dé la API de Mapbox ^ lo de arriba sera lo que este aqui
    };
  };
});
// animos chicos mañana le damos duro
