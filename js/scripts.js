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

// Capa vectorial de centroides asentamientos informales en formato GeoJSON
$.getJSON("https://dvictoria2020.github.io/tarea-4/datos/asentamientos_informales.geojson", function(geodata) {
  //Registros individuales
  var capa_asentamientos_informales = L.geoJson(geodata, {
    style: function() {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre del Asentamiento Informal</strong>: " + feature.properties.nombre_asentamiento + "<br>" +
                      "<strong>Distrito</strong>: " + feature.properties.distrito + "<br>" +
                      "<strong>Cantidad de viviendas</strong>: " + feature.properties.viviendas;
      layer.bindPopup(popupText);
    },			
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoVivienda});
    }
  });

  // Registros agrupados
  var asentamientos_informales_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  asentamientos_informales_agrupados.addLayer(capa_asentamientos_informales);

  // Se añade la capa al mapa y al control de capas
  asentamientos_informales_agrupados.addTo(mapa);
  control_capas.addOverlay(asentamientos_informales_agrupados, 'Registros agrupados de asentamientos informales agrupados');
  control_capas.addOverlay(capa_asentamientos_informales, 'Registros individuales de asentamientos informales individuales');
});

// Capa vectorial de registros áreas públicas
$.getJSON("https://dvictoria2020.github.io/tarea-4/datos/areas_publicas.geojson", function(geodata) {
  //Registros individuales
  var capa_areas_publicas = L.geoJson(geodata, {
    style: function() {
	  return {'color': "green", 'weight': 0.5}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Nombre</strong>: " + feature.properties.nom_refere + "<br>" +
                      "<strong>Tipo</strong>: " + feature.properties.tipo;
      layer.bindPopup(popupText);
    },			
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoParques});
    }
  });

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_areas_publicas_calor = L.heatLayer(coordenadas, {radius: 30, blur: 10, gradient: {0.5: 'purple', 0.8: 'green', 1: 'red'}});  
  
  // Se añaden las capas al mapa y al control de capas
  capa_areas_publicas_calor.addTo(mapa);
  control_capas.addOverlay(capa_areas_publicas_calor, 'Mapa de calor de las áreas públicas');
  // capa_areas_publicas.addTo(mapa);
  control_capas.addOverlay(capa_areas_publicas, 'Registros individuales de áreas públicas');
});