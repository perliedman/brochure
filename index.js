"use strict";

if (typeof module !== 'undefined') {
	var L = require("leaflet"),
		tileJson = require("leaflet-tilejson"),
		reqwest = require("reqwest"),
		Handlebars = require("handlebars");
}

if (!L.Icon.Default.imagePath) {
	L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.6.4/images";
}

L.Brochure = L.Class.extend({
	options: {
		fitFeatures: true
	},

	initialize: function(id, options) {
		var _this = this;

		function initMap(tileJson) {
			_this.map = L.TileJSON.createMap(id, tileJson, options);
			_this._createGeoJson()
			if (options.onMapCreated) {
				options.onMapCreated(_this.map);
			}
		}

		L.Util.setOptions(this, options);
		this.popupTemplate = options.popupTemplate ? 
			Handlebars.compile(options.popupTemplate) 
			: null;

		if (options.tileJson) {
			initMap(options.tileJson);
		} else if (options.tileJsonUrl) {
			reqwest({
				url: options.tileJsonUrl + "?jsonp=callback",
				type: "jsonp",
				jsonpCallback: 'jsonp',
				jsonpCallbackName: 'callback',
  				success: function(resp) {
					initMap(resp);
				}
			})
		}
	},

	_onEachFeature: function(geojson, layer) {
		if (this.popupTemplate) {
			layer.bindPopup(this.popupTemplate(geojson));
		}
	},

	_createGeoJson: function() {
		var _this = this,
			geoJson = L.geoJson(null, {
				onEachFeature: function(geoJson, layer) { _this._onEachFeature(geoJson,layer); }
			});

		function initGeoJson(data) {
			geoJson
				.addData(data)
				.addTo(_this.map);

			if (_this.options.fitFeatures) {
				_this.map.fitBounds(geoJson.getBounds());
			}
		}

		if (this.options.geoJson) {
			initGeoJson(this.options.geoJson);
		}

		if (this.options.geoJsonUrl) {
			reqwest({
				url: this.options.geoJsonUrl,
				type: "jsonp",
  				success: function(resp) {
					initGeoJson(resp);
				}
			})
		}
	}
})