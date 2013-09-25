"use strict";

if (typeof module !== 'undefined') {
	var L = require("leaflet"),
		tileJson = require("leaflet-tilejson"),
		reqwest = require("reqwest"),
		Handlebars = require("handlebars");
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
			_this._createGeoJson()
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
			})
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

			if (_this.options.markFeature) {
				var layer = _this.features[_this.options.markFeature];
				if (layer) {
					layer.openPopup();
				}
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