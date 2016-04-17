// Variables y Objetos globales.
var mapa = null;
var layer_estaciones_servicio = null;
var v_geojsonLayer = null;

function cargarMapa(){
	// Asuncion - Paraguay.
	var longitud = -57.6309129;
	var latitud = -25.2961407;
	var zoom = 14;

	mapa =  L.map('map-container').setView([latitud, longitud], zoom);

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
            for(var i = 0; i < data.elements.length; i++) {
                var elemento = data.elements[i];
                if (elemento.id in this.instance._ids){
					return;
				}
	            this.instance._ids[elemento.id] = true;
	            var posicion = new L.LatLng(elemento.lat, elemento.lon);
				var popup = popup_info(elemento.tags, elemento.id);
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

	// Controles.
	// Control ubicacion.
	L.control.locate({
	    position: 'topleft',  // set the location of the control
	    layer: undefined,  // use your own layer for the location marker, creates a new layer by default
	    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
	    follow: false,  // follow the user's location
	    setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
	    keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
	    stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
	    remainActive: false, // if true locate control remains active on click even if the user's location is in view.
	    markerClass: L.circleMarker, // L.circleMarker or L.marker
	    circleStyle: {},  // change the style of the circle around the user's location
	    markerStyle: {},
	    followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
	    followMarkerStyle: {},
	    icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
	    iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
	    iconElementTag: 'span',  // tag for the icon element, span or i
	    circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
	    metric: true,  // use metric or imperial units
	    onLocationError: function(err) {alert(err.message)},  // define an error callback function
	    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
	            alert(context.options.strings.outsideMapBoundsMsg);
	    },
	    showPopup: true, // display a popup when the user click on the inner marker
	    strings: {
	        title: "Ubícame",  // title of the locate control
	        metersUnit: "meters", // string for metric units
	        feetUnit: "feet", // string for imperial units
			popup: "Aqu&iacute; estoy!!!",  // text to appear if user clicks on circle
	        outsideMapBoundsMsg: "Estas fuera del l&iacute;mite del mapa." // default message for onLocationOutsideMapBounds
	    },
	    locateOptions: {
			maxZoom: zoom
		}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
	}).addTo(mapa);

	////////////////////////////////////////////////////////////////////////
	// Funciones internas.
	////////////////////////////////////////////////////////////////////////

	// Funcion que muestra un pop por cada estacion de servicio.
	function popup_info(tags, id) {
	    var popupString = '<div class="popup">';

		// Se agrega el link para poder editar.
		popupString += '<a href = "http://www.openstreetmap.org/edit?editor=id&node='
		  + id +'" target = "_blank">Editar</a><br>';

		var array_etiquetas = Array();

		// Se elimina amenity.
		delete tags.amenity;

		if(tags.name !== undefined){
			array_etiquetas.push({
				etiqueta: "Nombre",
				valor: tags.name
			});
			// Se elimina name.
			delete tags.name;
		}
		if(tags.brand !== undefined){
			array_etiquetas.push({
				etiqueta: "Marca",
				valor: tags.brand
			});
			// Se elimina brand.
			delete tags.brand;
		}
		for(var indice in array_etiquetas){
			popupString += '<b>' + array_etiquetas[indice].etiqueta + '</b>: '
			  + array_etiquetas[indice].valor + '<br />';
		}

	    for(var k in tags) {
	        var v = tags[k];
			// Como viene de la base de datos el campo todo en minuscula,
		    // queremos tener la primera letra en mayuscula.
		    var etiqueta = k.charAt(0).toUpperCase() + k.slice(1);
			switch (etiqueta) {
				case "Fuel:diesel":
					etiqueta = "Diesel";
					break;
				case "Fuel:e85":
					etiqueta = "e85";
					break;
				case "Fuel:octane_95":
					etiqueta = "95 octanos";
					break;
				case "Fuel:octane_98":
					etiqueta = "98 octanos";
					break;
				default:
					etiqueta = etiqueta;
			}
			if(v ===  "yes"){
				v = "Sí";
			}else if (v ===  "no"){
			     v = "No";
			}
			popupString += '<b>' + etiqueta + '</b>: ' + v + '<br />';
		}
	    popupString += '</div>';
	    return popupString;
	}
}
