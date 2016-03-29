// Variables y Objetos globales.
var mapa = null;
var layer_estaciones_servicio = null;

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

	// Se obtiene estaciones de servicio.
	$.getJSON("datos/estaciones_servicio.geojson", function(data){
		layer_estaciones_servicio = L.geoJson(data, {
			pointToLayer: function(feature, latlng) {
			    // Iconos de las estaciones de servicio.
				// Copetrol.
                var copetrol =  L.icon({
                    iconUrl: 'recursos/img/copetrol_32px.png',
                    iconSize: [32, 16]
                });

				// Barcos & Rodados.
				var barcos_rodados =  L.icon({
                    iconUrl: 'recursos/img/Barcos&Rodados_32px.png',
                    iconSize: [32, 23]
                });

				// Esso.
                var esso =  L.icon({
                    iconUrl: 'recursos/img/esso_32px.png',
                    iconSize: [32, 23]
                });

				// Petrobras.
                var petrobras =  L.icon({
                    iconUrl: 'recursos/img/petrobras_32px.png',
                    iconSize: [32, 27]
                });

				// Puma.
                var puma =  L.icon({
                    iconUrl: 'recursos/img/puma_32px.png',
                    iconSize: [32, 14]
                });

				// Por defecto.
				var predeterminado = L.icon({
                    iconUrl: 'libs/leaflet/images/marker-icon.png',
                    iconSize: [25, 41]
                });

				var temp_icono;
			    switch (feature.properties.brand) {
					case "Barcos & Rodados":
						temp_icono = barcos_rodados;
						break;
					case "Copetrol":
						temp_icono = copetrol;
						break;
					case "Esso":
						temp_icono = esso;
						break;
		            case "Petrobras":
						temp_icono = petrobras;
						break;
					case "Puma":
						temp_icono = puma;
						break;
					default:
						temp_icono = predeterminado;
		        }
				return L.marker(latlng, {
					icon: temp_icono
				});
            },
			onEachFeature: popup
		}).addTo(mapa);
	});

	////////////////////////////////////////////////////////////////////////
	// Funciones internas.
	////////////////////////////////////////////////////////////////////////

	// Funcion que muestra un pop por cada estacion de servicio.
	function popup(feature, layer) {
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
