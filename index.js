"use strict";

if (typeof module !== 'undefined') {
	var L = require("leaflet"),
		tileJson = require("leaflet-tilejson"),
		reqwest = require("reqwest"),
		Handlebars = require("handlebars");
}

if (!L.Icon.Default.imagePath) {
	L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.6.4/images"
}

function isString(o) {
	return typeof o == 'string' || o instanceof String;
}

L.Brochure = L.Class.extend({
	options: {
		fitFeatures: true,
		mapOptions: {}
	},

	initialize: function(id, options) {
		var _this = this;

		function initMap(tileJson) {
			_this.map = L.TileJSON.createMap(id, tileJson, _this.options.mapOptions);
			_this.geoJsonLayer = L.geoJson(null, {
				onEachFeature: function(geoJson, layer) { _this._onEachFeature(geoJson,layer); }
			}).addTo(_this.map);

			if (_this.options.geoJson) {
				if (isString(_this.options.geoJson) || _this.options.geoJson.url) {
					_this.loadGeoJson(_this.options.geoJson)
						.always(function() {
							if (_this.options.fitFeatures) {
								_this.map.fitBounds(_this.geoJsonLayer.getBounds());
							}
							if (_this.options.markFeature) {
								_this.markFeature(_this.options.markFeature);
							}
						});
				} else {
					_this.addGeoJson(_this.options.geoJson);
				}
			}

			if (options.onMapCreated) {
				options.onMapCreated(_this.map);
			}
		}

		L.Util.setOptions(this, options);
		this.popupTemplate = options.popupTemplate ? 
			Handlebars.compile(options.popupTemplate) 
			: null;
		this.features = {};

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
			});
		}
	},

	_onEachFeature: function(geojson, layer) {
		if (this.popupTemplate) {
			layer.bindPopup(this.popupTemplate(geojson));
		}
		if (this.options.featureIndexer) {
			var index = this.options.featureIndexer(geojson);
			this.features[index] = layer;
		}
	},

	addGeoJson: function(geojson) {
		this.geoJsonLayer.addData(geojson);
	},

	loadGeoJson: function(o) {
		var _this = this,
			params = o;

		if (isString(params)) {
			params = {
				url: params,
				type: "json",
				crossOrigin: true
			};
		}

		return reqwest(params).then(function(resp) {
			_this.addGeoJson(resp);
		});
	},

	markFeature: function(id) {
		if (this.features[id]) {
			this.features[id].openPopup();
		}
	}
});

