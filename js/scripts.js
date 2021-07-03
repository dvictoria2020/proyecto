// Mapa Leaflet
var mapa = L.map('mapid').setView([9.94, -84.13], 14);

// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

var capa_topografico = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', 
  {
	maxZoom: 19,
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
  "Topografico": capa_topografico,
  "ESRI": capa_esri

};
	    
// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

// Capa de coropletas sobre terrenos del estado en formato GeoJSON
$.getJSON('https://dvictoria2020.github.io/tarea-3/datos/terrenos/terrenos_estado.geojson', function (geojson) {
  var capa_terrenos = L.choropleth(geojson, {
	    valueProperty: 'area',
	    scale: ['white', 'purple'],
	    steps: 7,
	    mode: 'q',
	    style: {
	      color: '#fff',
	      weight: 0.5,
	      fillOpacity: 0.5
	    }, 
      onEachFeature: function(feature, layer) {
        var popupText = "<strong>Propietario</strong>: " + feature.properties.nom_juridi + "<br>" + "<strong>Tipo de Inmueble</strong>: " + feature.properties.t_inmueb +  "<br>" + "<strong>Amenazas</strong>: " + feature.properties.r_fisica + "<br>" + "<strong>Número de finca</strong>: " + feature.properties.finca;
        layer.bindPopup(popupText);
      }
  }).addTo(mapa);
  control_capas.addOverlay(capa_terrenos, 'Terrenos del Estado');

  // Leyenda de la capa de coropletas sobre terrenos del estado
  var leyenda = L.control({ position: 'bottomleft' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_terrenos.options.limits
    var colors = capa_terrenos.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
            <div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
    }
    leyenda.addTo(mapa)
});

// Capa raster deficit habitacional MIVAH
var capa_deficit_habitacional = L.imageOverlay("https://dvictoria2020.github.io/tarea-3/datos/deficit/DeficitHabitacional.png", 
	[[9.9055601491738656, -84.1796468648582987], 
	[9.9718107353507541, -84.0860167000804068]], 
	{opacity:0.4}
).addTo(mapa);
control_capas.addOverlay(capa_deficit_habitacional, 'Déficit habitacional');

function updateOpacityDef() {
  document.getElementById("span-opacity-Def").innerHTML = document.getElementById("sld-opacity-Def").value;
  capa_deficit_habitacional.setOpacity(document.getElementById("sld-opacity-Def").value);
}