// Mapa Leaflet
var mapa = L.map('mapid').setView([9.93, -84.12], 13.5);

// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Otra capa base esri
var capa_esri = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
    {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
).addTo(mapa)

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "ESRI": capa_esri,
};

// Ícono personalizado para asentamientos informales
const iconoVivienda = L.divIcon({
  html: '<i class="fas fa-house-damage fa-2x"></i>',
  className: 'estiloIconos'
});

// Ícono personalizado para áreas públicas
const iconoParques = L.divIcon({
  html: '<i class="fas fa-thumbtack fa"></i>',
  className: 'estiloIconos'
});
	    
// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

// Capa vectorial de terrenos del estado en formato GeoJSON
$.getJSON("https://dvictoria2020.github.io/proyecto/datos/terrenos_estado1.geojson", function(geodata) {
  var terrenos = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "red", 'weight': 1.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Propietario</strong>: " + feature.properties.nom_juridi + "<br>" + "<strong>Tipo de Inmueble</strong>: " + feature.properties.t_inmueb + "<br>" + "<strong>Clasificación</strong>: " + feature.properties.clasific + "<br>" + "<strong>Amenazas</strong>: " + feature.properties.r_fisica + "<br>" + "<strong>Número de finca</strong>: " + feature.properties.finca;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(terrenos, 'Terrenos del Estado');
});