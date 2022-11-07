import { Map, View } from 'ol';
import KML from 'ol/format/KML';
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import './style.css';

useGeographic();

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');
const durationElement = document.getElementById('duration');
const mode = document.getElementById('radio_frequency')

const vector = new HeatmapLayer({
  source: new VectorSource({
    url: 'outage.kml',
    format: new KML({extractStyles: false}),
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
  weight: function (feature) {
    const name = feature.get('name');
    const duration = parseInt(durationElement.value, 10)
    
    if (mode.value == "frequency") {
      const magnitude = parseFloat(name.split("_")[2])/100;
      return magnitude;
    }
    else {
      const magnitude = parseFloat(name.split("_")[3])/duration;
      return magnitude;
    }
  },
});

blur.addEventListener('input', function () {
  vector.setBlur(parseInt(blur.value, 10));
});

durationElement.addEventListener('input', function() {
  vector.getSource().refresh()
})
mode.addEventListener('input', function() {
  vector.getSource().refresh()
})
radius.addEventListener('input', function () {
  vector.setRadius(parseInt(radius.value, 10));
});

const raster = new TileLayer({
  source: new Stamen({
    layer: 'toner',
  }),
});

const place = [-122.2211144, 47.7196182]

const map = new Map({
  target: 'map',
  layers: [
    raster,
    vector
  ],
  view: new View({
    center: place,
    zoom: 14
  })
});
