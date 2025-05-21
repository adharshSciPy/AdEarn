import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./adform.module.css";
import tickAd from "../../../assets/tickAd.png"
// Leaflet default icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarkers({ positions, setPositions }) {
  useMapEvents({
    click(e) {
      setPositions((prev) => [
        ...prev,
        { lat: e.latlng.lat, lng: e.latlng.lng, radiusKm: 30 },
      ]);
    },
  });

  const removePin = (indexToRemove) => {
    setPositions((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      {positions.map((pos, index) => (
        <React.Fragment key={index}>
          <Marker
            position={{ lat: pos.lat, lng: pos.lng }}
            eventHandlers={{ click: () => removePin(index) }}
          />
          <Circle
            center={{ lat: pos.lat, lng: pos.lng }}
            radius={pos.radiusKm * 1000}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
        </React.Fragment>
      ))}
    </>
  );
}

function    AdForm() {
  const [positions, setPositions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRadiusChange = (index, newRadius) => {
    const updated = [...positions];
    updated[index].radiusKm = Number(newRadius);
    setPositions(updated);
  };

  const handleSearch = async () => {
  if (!searchInput.trim()) {
    alert("Please enter a place name or pincode");
    return;
  }
  setLoading(true);
  try {
    // Append " India" to bias the search within India
    const query = searchInput.trim() + " India";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Nominatim API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.length === 0) {
      alert("Location not found. Please refine your search.");
    } else {
      const { lat, lon } = data[0];
      setPositions((prev) => [
        ...prev,
        { lat: parseFloat(lat), lng: parseFloat(lon), radiusKm: 30 },
      ]);
      setSearchInput("");
    }
  } catch (err) {
    console.error("Error fetching location:", err);
    alert("Error fetching location. Try again later.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className={styles.adFormMain}>
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Name</h2>
              <input className={styles.AdInput} type="text" placeholder="Name of your Ad" />
            </div>
          </div>
          <div className={styles.labelContainer} style={{marginTop:"20px"}}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Category</h2>
              <select name="" id="" className={styles.selectOption}>
                <option>Select Category</option>
                <option>Employment</option>
                <option>Small Businesses</option>
                <option>Large Businesses</option>
                <option>Finacial Product and Services</option>
                <option>Housing</option>
                <option>Social Issue  </option>


              </select>
            </div>
          </div>
        </div>
        <div className={styles.container}>
        <h3 style={{paddingBottom:"20px"}}>Select Location</h3>
        <MapContainer
          center={[8.5241, 76.9366]}
          zoom={12}
          style={{ height: "400px", width: "100%",borderRadius:"20px" ,overflow:"hidden"}}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarkers positions={positions} setPositions={setPositions} />
        </MapContainer>
      

      
        <h3 className={styles.heading}>Search Location / Pincode</h3>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Enter place or pincode"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.inputBox}
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className={styles.searchBtn}
            disabled={loading}
          >
            {loading ? "Searching..." : "Add Pin"}
          </button>
        </div>

        <h3 className={styles.heading}>Selected Pins</h3>
        {positions.map((pos, index) => (
          <div key={index} className={styles.result}>
            <p>
              Lat: {pos.lat.toFixed(4)}, Lng: {pos.lng.toFixed(4)}
              <button
                className={styles.removeBtn}
                onClick={() =>
                  setPositions((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                }
              >
                ❌
              </button>
            </p>
            <input
              type="number"
              min={1}
              className={styles.inputBox}
              value={pos.radiusKm}
              onChange={(e) => handleRadiusChange(index, e.target.value)}
              placeholder="Radius (km)"
            />
          </div>
        ))}
      </div>
      </div>
    </>
  );
}

export default AdForm;
