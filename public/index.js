const socket = io(); // Ensure this is loaded after the socket.io script

const map = L.map("map").setView([33.4135, 73.0350], 10); // Set to visible coordinates
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors"
}).addTo(map);

const markers = {};

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      console.log("Position:", position); // Debugging
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2000,
    }
  );
} else {
  console.error("Geolocation not supported by this browser.");
}

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log("Received location:", data); // Debugging
  
  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }
});

socket.on("user-disconnected", (id) => {
  console.log("User disconnected:", id); // Debugging
  
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
