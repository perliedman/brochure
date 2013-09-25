Brochure
========

Brochure is a tiny library to create maps using [TileJSON](https://github.com/perliedman/TileJSON/tree/master/2.0.0) and [GeoJson](http://geojson.org/) with minimal coding effort. Essentially a
[Leaflet](http://leafletjs.com/) and [leaflet-tilejson](https://github.com/kartena/leaflet-tilejson) wrapper.

See the small [Brochure demo](http://perliedman.github.com/brochure/)!

Usage
-----

```sh
npm install
browserify example/index.js >example/all.js
```

Open ```example/index.html``` in your browser.

API
---

Brochure creates a new class in Leaflet's namespace, called ```L.Brochure```. Creating a Brochure instance
will create a map, add a tilelayer to it, and optionally load some GeoJSON into it. The GeoJSON features can have popups attached to it.

### Example

```js
var brochure = new L.Brochure("map", {
	tileJsonUrl: "http://api.geosition.com/tile-meta/osm-bright-3006.jsonp",
	geoJsonUrl: "http://content.kartena.se/viewer/GeoJson/MapItem/?all=1&cid=70&category=160",
	popupTemplate:
		"<h2>{{properties.Name}}</h2>" +
		"<h3>Address</h3>" +
		"{{properties.Attributes.Adress.Value}}<br/>" + 
		"{{properties.Attributes.Postnr.Value}} {{properties.Attributes.Ort.Value}}"
});
```

### Constructor

```js
L.Brochure(id, options)
```

* ```id``` is the id of the div where in which the map should be created, just as for ```L.Map```.
* ```options``` are the creation opions:
	* ```mapOptions``` are the options passed to ```L.Map``` when creating the map
	* ```tileJson``` optional TileJSON object to be used to instantiate the map
	* ```tileJsonUrl``` URL to a TileJSON JSONP service to be used to instantiate the map
	* ```geoJson``` is a GeoJson object, or array of GeoJSON objects to add to the map
	* ```geoJsonUrl``` is a URL to a JSONP service that will return GeoJson to add to the map
	* ```popupTemplate``` a [Handlebars](http://handlebarsjs.com/) template used for generating
	  popup contents for a GeoJson feature. If not specified, popups will not be added.
	* ```fitFeatures``` if set, the map will be zoomed to fit all the GeoJson features in the view; default is true
	* ```featureIndexer``` a function that will produce a unique identifier given a GeoJson feature;
	  if specified, all features will be indexed in the instance's ```features``` object
	* ```markFeature``` the identifier (returned by the ```featureIndexer```) of the GeoJson feature to
	  mark on the map, and open the popup for

