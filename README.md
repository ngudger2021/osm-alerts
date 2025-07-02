# OSM Alerts

A simple mobile-friendly web application for reporting road hazards using OpenStreetMap and Leaflet.

The page fetches Leaflet and map tiles from the internet. If you see only a blank page with a floating `+` button that does nothing, the Leaflet library may have failed to load (e.g. due to no internet connection). In that case ensure you are online or host the Leaflet assets locally.

Because the app relies on the browser's geolocation API, the page must be served via
HTTP/HTTPS (browsers block geolocation on plain `file://` URLs). Run a local server
and then open `http://localhost:8000/index.html`:

```bash
python3 -m http.server 8000
```

Once loaded, allow location access to see your position on the map. Use the `+`
button to report roadworks, potholes or crashes – these markers are stored in your
browser's local storage.
