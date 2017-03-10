// Centralna pozicija
var oCenter = ol.proj.fromLonLat([16.374681, 46.292180]);
var oView = new ol.View({
	  center: oCenter,
	  zoom: 8
	})

var markerIcon = new ol.Feature({
  geometry: new ol.geom.Point(oCenter),
  name: 'Predrag Makaj',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'https://openlayers.org/en/v4.0.1/examples/data/icon.png'
  }))
});

var vectorSource = new ol.source.Vector({
  features: [markerIcon]
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: iconStyle
});

var map = new ol.Map({
  layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
  target: document.getElementById('map'),
  view: oView
});

var popupContainer = document.getElementById('popup');

var popup = new ol.Overlay({
  element: popupContainer,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50]
});
map.addOverlay(popup);

// display popup on click
map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature) {
        return feature;
      });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(popupContainer).popover({
      'placement': 'top',
      'html': true,
      'content': feature.get('name')
    });
    $(popupContainer).popover('show');
  } else {
    $(popupContainer).popover('destroy');
  }
});

// change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(popupContainer).popover('destroy');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
