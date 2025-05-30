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
import tickAd from "../../../assets/tickAd.png";
import Navbar from "../NavBar/Navbar";
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

const stateCityMap = {
  Kerala: [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  Karnataka: [
    "Bagalkot",
    "Bangalore Urban",
    "Bangalore Rural",
    "Belagavi",
    "Bellary",
    "Bidar",
    "Chamarajanagar",
    "Chikballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davangere",
    "Dharwad",
    "Gadag",
    "Gulbarga",
    "Hassan",
    "Haveri",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shimoga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Navi Mumbai",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Kadapa",
    "Krishna",
    "Kurnool",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "West Godavari",
    "YSR Kadapa",
  ],
  "Arunachal Pradesh": [
    "Tawang",
    "West Kameng",
    "East Kameng",
    "Papum Pare",
    "Kurung Kumey",
    "Kra Daadi",
    "Upper Subansiri",
    "Lower Subansiri",
    "West Siang",
    "East Siang",
    "Siang",
    "Lower Dibang Valley",
    "Upper Dibang Valley",
    "Changlang",
    "Tirap",
    "Longding",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Bastar",
    "Bemetara",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Janjgir-Champa",
    "Jashpur",
    "Korba",
    "Korea",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],
  Goa: ["North Goa", "South Goa"],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udepur",
    "Dahod",
    "Dang",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kullu",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],
  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela-Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul"],
  Meghalaya: ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"],

  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah"],
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Diglipur",
    "Mayabunder",
    "Rangat",
    "Hut Bay",
  ],
  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "East Delhi",
    "West Delhi",
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Udhampur",
  ],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti", "Agatti", "Amini", "Andrott", "Kalpeni"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  // Add more states and cities here
};
function AdForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    state: "",
    city: "",
    pincode: "",
    location: "",
  });
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
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <Navbar />
      <div className={styles.adFormMain}>
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Name</h2>
              <input
                className={styles.AdInput}
                type="text"
                placeholder="Name of your Ad"
              />
            </div>
          </div>
          <div className={styles.labelContainer} style={{ marginTop: "20px" }}>
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
                <option>Social Issue </option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <h3 style={{ paddingBottom: "20px" }}>Select Location</h3>
          <MapContainer
            center={[8.5241, 76.9366]}
            zoom={12}
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarkers
              positions={positions}
              setPositions={setPositions}
            />
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
                    setPositions((prev) => prev.filter((_, i) => i !== index))
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
                placeholder="Radius (km)"
                onChange={(e) => handleRadiusChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className={styles.adName} style={{ marginTop: "30px" }}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Region</h2>
            </div>
          </div>
          <div className={styles.labelContainer} style={{ marginTop: "30px" }}>
            <div className={styles.AdNameHead}>
              <p>State</p>
              <select
                className={styles.selectOption}
                required
                value={form.state || ""}
                onChange={handleChange}
                name="state"
              >
                <option>Select Your State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </div>
          </div>
          <div className={styles.labelContainer} style={{ marginTop: "20px" }}>
            <div className={styles.AdNameHead}>
              <p>District</p>
              <div className="">
                <label htmlFor=""></label>
              </div>
              <select
                className={styles.selectOption}
                required
                name="city"
                style={{ marginBottom: "10px" }}
              >
                <option value="">Select Your City</option>
                {(stateCityMap[form.state] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.labelContainer} style={{ marginTop: "20px" }}>
            <div className={styles.AdNameHead}>
              <p>Pincode</p>
              <input
                className={styles.AdInput}
                type="number"
                placeholder="Pincode Number"
              />
            </div>
          </div>
        </div>
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>View Required</h2>
              <select
                className={styles.selectOption}
                style={{ marginTop: "20px" }}
                required
                value={form.state || ""}
                onChange={handleChange}
                name="state"
              >
                <option>Select Your Plan</option>
                <option value="120">200 views 120 Star</option>
                <option value="240">400 views 240 Star</option>
                <option value="480">800 views 480 Star</option>
                <option value="960">1600 views 960 Star</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.buttondiv}>
          <div className="">
            <button className={styles.backButton}>Back</button>
            <button
              style={{
                backgroundColor: "#3563E9",
                border: "none",
                color: "white",
              }}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdForm;
