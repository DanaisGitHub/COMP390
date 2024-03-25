"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = exports.generateRandomLatLng = void 0;
// random location generator in liverpool
function generateRandomLatLng(radiusInKm) {
    const earthRadiusKm = 6371; // Earth's radius in kilometers
    // Manchester's latitude and longitude
    const manchesterLat = 53.4808;
    const manchesterLng = -2.2426;
    // Convert radius from kilometers to degrees
    const radiusInDegrees = radiusInKm / earthRadiusKm;
    // Random angle
    const angle = Math.random() * Math.PI * 2;
    // Random distance within the radius
    const distance = Math.random() * radiusInDegrees;
    // Calculate random point's latitude and longitude
    const randomLat = manchesterLat + (distance * Math.cos(angle));
    const randomLng = manchesterLng + (distance * Math.sin(angle));
    return { lat: randomLat, lng: randomLng };
}
exports.generateRandomLatLng = generateRandomLatLng;
function calculateDistance(lat1, lng1, lat2, lng2) {
    const earthRadiusKm = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLng = degreesToRadians(lng2 - lng1);
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}
exports.calculateDistance = calculateDistance;
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
