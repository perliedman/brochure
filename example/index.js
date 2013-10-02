var L = require("leaflet"),
	Brochure = require("../");

var brochure = new L.Brochure("map", {
	tileJsonUrl: "http://api.geosition.com/tile-meta/osm-bright-3006.jsonp",
	geoJson: "map.geojson",
	popupTemplate:
		"<h2>{{properties.name}}</h2>" +
		"<p>{{properties.desc}}</p>"
});

// to ease debugging
window.brochure = brochure;