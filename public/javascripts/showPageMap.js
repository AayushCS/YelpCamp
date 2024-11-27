mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  projection: "globe",
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);
