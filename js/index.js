/* global mapboxgl */

// api localizaar zona mediante texto y transformarla a lnglat

const localidad = "barcelona";
const mapboxToken =
  "pk.eyJ1IjoiemlpbmlrIiwiYSI6ImNrcGk3c3UxZzAwNmQycHAwZTk0YjhpemUifQ.TfQ7tlPczVzbIefuWdtPtA"; // Mete aquí el Token de Mapbox
const geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${localidad}.json?&access_token=${mapboxToken}`;
const datosMapa = fetch(geocodingApi)
  .then((dato) => dato.json())
  .then((datos) => arrayCoordenadas(datos.features[0].geometry.coordinates));
mapboxgl.accessToken = mapboxToken;

// ruta con coordenades desde origen hasta destino y itinerario de como llegar y tempo empleado

const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "ba67b92e"; // Mete aquí el app_id de TMB
const appKey = "d65b2261fc0be12f06f831fc8334fe5a"; // Mete aquí el app_key de TMB
const metropolitano /* ano jaja */ = fetch(
  `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=41.3755204,2.1498870&toPlace=41.422520,2.187824&date=06/06/2021&time=11:58am&arriveBy=11:58am&mode=TRANSIT,WALK`
);
console.log(metropolitano);

//captacion de las coordenadas introducidas en mapbox
let coordenadasBarcelona = [];
const arrayCoordenadas = (array) => {
  coordenadasBarcelona = array; //aqui sacamos las coordenadas del fetch

  console.log(coordenadasBarcelona);
  const mapa = document.querySelector(".mapa");
  console.log();
  console.log();
  // LLama a esta función para generar el pequeño mapa que sale en cada paso
  // Le tienes que pasar un array con las dos coordenadas y el elemento HTML donde tiene que generar el mapa
  const generaMapa = (coordenadas, mapa) => {
    const mapbox = new mapboxgl.Map({
      container: mapa,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordenadas,
      zoom: 12,
    });
    let marcador = new mapboxgl.Marker().setLngLat(coordenadas).addTo(mapbox);
    const geolocalizar = new MapboxGeocoder({
      //ponemos buscador to cool para que mario este contento y nosotros autosatisfechos :3
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Encuentrate :DDDDD",
    });
    mapbox.addControl(geolocalizar);
  };

  generaMapa(coordenadasBarcelona, mapa); //generamos un mapa con las coordenadas que queremos, tendremos que cambiarlo a la hora de poner el bucle segun si es current location o location buscada

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
