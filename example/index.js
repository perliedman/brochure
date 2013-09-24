var L = require("leaflet"),
	Brochure = require("../");

var brochure = new L.Brochure("map", {
	tileJsonUrl: "http://api.geosition.com/tile-meta/lm.jsonp",
	geoJsonUrl: "http://content.kartena.se/viewer/GeoJson/MapItem/?all=1&cid=70&category=160",
	popupTemplate:
		"<h2>{{properties.Name}}</h2>" +
		"<h3>Adress</h3>" +
		"{{properties.Attributes.Adress.Value}}<br/>" + 
		"{{properties.Attributes.Postnr.Value}} {{properties.Attributes.Postort.Value}}" +
		"<p><em>Antal platser:</em> {{properties.Attributes.Antal platser.Value}}"
});
