import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapaContacto() {
  const position = [-34.44548603723854, -58.98292763996581];

  return (
    <div className="rounded-lg overflow-hidden shadow-elegant h-96">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-primary-900">V&A DISEÑO Y MODA</h3>
              <p className="text-sm text-neutral-600">Zona Sur, Buenos Aires</p>
              <a 
                href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-primary-900 text-xs font-semibold"
              >
                Ver en Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapaContacto;
