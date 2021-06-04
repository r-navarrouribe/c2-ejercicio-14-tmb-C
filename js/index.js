/* global mapboxgl */

// Datos para las APIs
const localidad = "barcelona";
const mapboxToken =
  "pk.eyJ1IjoiemlpbmlrIiwiYSI6ImNrcGk3c3UxZzAwNmQycHAwZTk0YjhpemUifQ.TfQ7tlPczVzbIefuWdtPtA"; // Mete aquí el Token de Mapbox
const geocodingApi = `https://api.mapbox.com/geocoding/v5/mapbox.places/${localidad}.json?&access_token=${mapboxToken}`;
const datosMapa = fetch(geocodingApi)
  .then((dato) => dato.json())
  .then((datos) => arrayCoordenadas(datos.features[0].geometry.coordinates));

const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "ba67b92e"; // Mete aquí el app_id de TMB
const appKey = "d65b2261fc0be12f06f831fc8334fe5a"; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

let coordenadasBarcelona = [];
const arrayCoordenadas = (array) => {
  coordenadasBarcelona = array;

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
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Encuentrate :DDDDD",
    });
    mapbox.addControl(geolocalizar);
  };

  generaMapa(coordenadasBarcelona, mapa);

  // Coordenadas que se mandarán a la API de TMB. Tienes que alimentar este objeto a partir de las coordenadas que te dé la API de Mapbox
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
