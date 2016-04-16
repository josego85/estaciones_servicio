// Variables y Objetos globales.
var mapa = null;
var layer_estaciones_servicio = null;
var v_geojsonLayer = null;

function cargarMapa(){
	// Asuncion - Paraguay.
	var longitud = -57.6309129;
	var latitud = -25.2961407;
	var zoom = 14;

	mapa =  L.map('mapa').setView([latitud, longitud], zoom);

	// Humanitarian Style.
	L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap Contributors </a> Tiles \u00a9 HOT'
	}).addTo(mapa);

	// OverPassAPI overlay
	var opl = new L.OverPassLayer({
        //endpoint: "http://overpass.osm.rambler.ru/cgi/",
	    minzoom: 12,
        query: "node(BBOX)['amenity'='fuel'];out;",
        callback: function(data) {
			console.log("data: ", data);
            for(var i = 0; i < data.elements.length; i++) {
                var elemento = data.elements[i];
                if (elemento.id in this.instance._ids){
					return;
				}
	            this.instance._ids[elemento.id] = true;
	            var posicion = new L.LatLng(elemento.lat, elemento.lon);
	            var popup = this.instance._poiInfo(elemento.tags, elemento.id);
				//var popup = popup1(elemento.tags, elemento.id);
				var icono_estacion_servicio = L.icon({
					iconUrl: 'recursos/img/fuel.png',
					iconSize: [24, 24],
					iconAnchor: [-3, -3],
					popupAnchor: [0, 0]
				});
				var marcador = L.marker(posicion, {
					icon: icono_estacion_servicio
				}).bindPopup(popup);
				this.instance.addLayer(marcador);
        	}
      	},
      	minZoomIndicatorOptions: {
            position: 'topright',
            minZoomMessageNoLayer: "no layer assigned",
            minZoomMessage: "current Zoom-Level: CURRENTZOOM all data at Level: MINZOOMLEVEL"
        }
    }).addTo(mapa);

	////////////////////////////////////////////////////////////////////////
	// Funciones internas.
	////////////////////////////////////////////////////////////////////////

	// Funcion que muestra un pop por cada estacion de servicio.
	function popup1(feature, layer) {
		console.log("entro");
		if(feature.properties){
	        var popupString = '<div class="popup">';

	        for(var k in feature.properties) {
	            var v = feature.properties[k];

	            // Como viene de la base de datos el campo todo en minuscula,
	            // queremos tener la primera letra en mayuscula.
	            var etiqueta = k.charAt(0).toUpperCase() + k.slice(1)
	            popupString += '<b>' + etiqueta + '</b>: ' + v + '<br />';
	        }
	        popupString += '</div>';
	        layer.bindPopup(popupString);
    	}
	}
}
