let map;
let userMarker;
let currentPos;
const hazardKey = 'hazardReports';

function initMap() {
    map = L.map('map');
    map.setView([0,0], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(onLocationFound, onLocationError, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function onLocationFound(position) {
    currentPos = [position.coords.latitude, position.coords.longitude];
    if (!userMarker) {
        userMarker = L.marker(currentPos).addTo(map);
    } else {
        userMarker.setLatLng(currentPos);
    }
    map.setView(currentPos);
}

function onLocationError(err) {
    console.error('Location error:', err);
    alert('Unable to retrieve your location. Make sure the page is served via HTTP/HTTPS and that location access is allowed.');
}

function loadHazards() {
    const stored = localStorage.getItem(hazardKey);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch(e) {
        return [];
    }
}

function saveHazard(hazard) {
    const hazards = loadHazards();
    hazards.push(hazard);
    localStorage.setItem(hazardKey, JSON.stringify(hazards));
}

function showHazards() {
    const hazards = loadHazards();
    hazards.forEach(h => {
        const icon = getHazardIcon(h.type);
        L.marker([h.lat, h.lng], {icon}).addTo(map);
    });
}

function getHazardIcon(type) {
    const emojis = {
        roadworks: '🚧',
        pothole: '🕳️',
        crash: '🚗'
    };
    return L.divIcon({html: emojis[type], className: 'hazard-icon', iconSize: [24,24]});
}

function reportHazard(type) {
    if (!currentPos) return;
    const hazard = {lat: currentPos[0], lng: currentPos[1], type, time: Date.now()};
    saveHazard(hazard);
    const icon = getHazardIcon(type);
    L.marker(currentPos, {icon}).addTo(map);
}

function setupUI() {
    const btn = document.getElementById('report-btn');
    const menu = document.getElementById('hazard-menu');
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
    menu.addEventListener('click', e => {
        if (e.target.dataset.type) {
            reportHazard(e.target.dataset.type);
            menu.classList.add('hidden');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initMap();
    showHazards();
    setupUI();
});
