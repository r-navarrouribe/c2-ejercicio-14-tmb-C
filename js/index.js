/* global mapboxgl */

// api localizaar zona mediante texto y transformarla a lnglat

const localidad = "mataro,+santiago+rusiñol";
const mapboxToken =
  "pk.eyJ1IjoiemlpbmlrIiwiYSI6ImNrcGk3c3UxZzAwNmQycHAwZTk0YjhpemUifQ.TfQ7tlPczVzbIefuWdtPtA";
const geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${localidad}.json?&access_token=${mapboxToken}`;

// ruta con coordenades desde origen hasta destino y itinerario de como llegar y tempo empleado

const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "ba67b92e";
const appKey = "d65b2261fc0be12f06f831fc8334fe5a";

const metropolitano /* ano jaja */ = fetch(
  // llamada a la api tmb
  `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=41.3755204,2.1498870&toPlace=41.422520,2.187824&date=06/06/2021&time=11:58am&arriveBy=11:58am&mode=WALK,BUS,SUBWAY`
)
  .then((dato) => dato.json())
  .then((datos) => planning(datos.plan)); // extraccion del plan de la ruta de tmb ^ justo aqui arriba parametros obligatorios que he incluido coordenadas tendremos que asignarlas a constantes o varieables segun encesitemos
console.log(`llamada a TMB ${metropolitano}`);

/* patron que he seguido : primero creo una funcion llamada planning que recogue el planning, despues extraemos los datos etc recogidos en nuevaRuta, 
dentro creo una funcion nueva que recoge los datos del mapbox (quizas tengamos que invertirlas) extraigo los datos de coordenadas y lo introducimos en el mapa a la vez que lo generamos en  */

const planning = (datos) => {
  const nuevaRuta = { ...datos }; // creacion del objeto planning

  console.log(nuevaRuta);

  // captacion de las coordenadas introducidas en mapbox
  const datosMapa = fetch(geocodingApi)
    .then((dato) => dato.json())
    .then((datos) => arrayCoordenadas(datos.features[0].geometry.coordinates)); // aqui cojo la primera coordenada de la array pero hay muchas mas, queda por ver /se podria hacer un bucle con datos.features y ver que podemos usar

  mapboxgl.accessToken = mapboxToken; // llamada a la api con su token

  const arrayCoordenadas = (array) => {
    const coordenadasBarcelona = array; // aqui sacamos las coordenadas del fetch

    console.log(coordenadasBarcelona);
    const mapa = document.querySelector(".mapa");
    // LLama a esta función para generar el pequeño mapa que sale en cada paso
    // Le tienes que pasar un array con las dos coordenadas y el elemento HTML donde tiene que generar el mapa
    const generaMapa = (coordenadas, mapa) => {
      const mapbox = new mapboxgl.Map({
        container: mapa, // clase donde se pondra el mapa
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordenadas, // solo las dos coordenadas donde se fijara el mapa al iniciarse
        zoom: 12,
      });

      const marcador = new mapboxgl.Marker()
        .setLngLat(coordenadas)
        .addTo(mapbox); // marcador para ubicarnos bien en el mapa

      const geolocalizar = new MapboxGeocoder({
        // ponemos buscador to cool para que mario este contento y nosotros autosatisfechos :3
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        placeholder: "Encuentrate :DDDDD",
      });

      mapbox.addControl(geolocalizar);
    };

    generaMapa(coordenadasBarcelona, mapa); // generamos un mapa con las coordenadas que queremos, tendremos que cambiarlo a la hora de poner el bucle segun si es current location o location buscada

    // Coordenadas que se mandarán a la API de TMB. Tienes que alimentar este objeto a partir de las coordenadas que te dé la API de Mapbox ^ lo de arriba sera lo que este aqui
    const coordenadas = {
      desde: {
        latitud: 0,
        longitud: 0,
      },
      hasta: {
        latitud: 0,
        longitud: 0,
      },
    };
  };
};

// animos chicos mañana le damos duro
