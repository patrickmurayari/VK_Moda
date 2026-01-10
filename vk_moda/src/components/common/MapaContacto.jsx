function MapaContacto() {
  const position = [-34.44548603723854, -58.98292763996581];

  return (
    <div className="rounded-lg overflow-hidden shadow-elegant h-96">
      <iframe
        title="Ubicación V&A DISEÑO Y MODA"
        src={`https://www.google.com/maps?q=${position[0]},${position[1]}&z=15&output=embed`}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0 }}
        allowFullScreen
      />
    </div>
  );
}

export default MapaContacto;
