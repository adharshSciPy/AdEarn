import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import baseUrl from "../../../baseurl";
// import successAnimation from "./success.json";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/sucess.json";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./adform.module.css";
import tickAd from "../../../assets/tickAd.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
// Fix leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Map click handler for adding location markers
function LocationMarkers({ positions, setPositions }) {
  useMapEvents({
    click(e) {
      setPositions((prev) => [
        ...prev,
        { lat: e.latlng.lat, lng: e.latlng.lng, radiusKm: 30 },
      ]);
    },
  });

  return (
    <>
      {positions.map((pos, index) => {
        const radiusMeters =
          pos.radiusKm && !isNaN(pos.radiusKm) ? pos.radiusKm * 1000 : 1000;

        return (
          <React.Fragment key={index}>
            <Marker position={[pos.lat, pos.lng]}>
              <Popup>{pos.name || "Selected location"}</Popup>
            </Marker>
            <Circle
              center={[pos.lat, pos.lng]}
              radius={radiusMeters}
              pathOptions={{ fillColor: "blue" }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

// Map view changer on pin select
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
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
  const { id } = useParams();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [singleTime, setSingleTime] = useState(false);
  const [multipleTime, setMultipleTime] = useState(false);
  const [timeOptions, setTimeOptions] = useState({
    "3hrs": false,
    "6hrs": false,
    "12hrs": false,
    "24hrs": false,
    "48hrs": false,
  });
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);

  const [form, setForm] = useState({
    state: [],
    city: [],
    viewPlan: "",
    adName: "",
    adPeriod: "",
    adCategory: "",
  });
  const [positions, setPositions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  // Toggle time options when multipleTime is selected
  const handleTimeChange = (label) => {
    const newOptions = {
      "3hrs": false,
      "6hrs": false,
      "12hrs": false,
      "24hrs": false,
      "48hrs": false,
      [label]: true,
    };
    setTimeOptions(newOptions);
    setSelectedTimeSlots(parseInt(label.replace("hrs", "")));
  };
  const handleFileChangeaudio = (e) => {
    const file = e.target.files[0];
    setAudio(file)
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewaudio(previewUrl);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: [] } : {}),
    }));
  };
  const rawCities = stateCityMap[form.state] || [];

  const cityOptions = form.state.flatMap((state) =>
    (stateCityMap[state] || []).map((city) => ({ value: city, label: city }))
  );

  const removeCity = (cityToRemove) => {
    setForm((prev) => ({
      ...prev,
      city: prev.city.filter((c) => c !== cityToRemove),
    }));
  };

  // Update radius for a pin
  const handleRadiusChange = (index, value) => {
    setPositions((prev) =>
      prev.map((pos, i) =>
        i === index
          ? { ...pos, radiusKm: value ? parseInt(value, 10) : "" }
          : pos
      )
    );
  };

  // Validate form before submit
  const validateForm = () => {
    if (!form.adName.trim()) {
      setSubmitError("Please enter the Ad Name");
      return false;
    }
    if (!form.adCategory.trim()) {
      setSubmitError("Please select Ad Category");
      return false;
    }
    const isMapSelected = positions.length > 0;
    const isRegionSelected = form.state.length > 0 && form.city.length > 0;

    if (!isMapSelected && !isRegionSelected) {
      setSubmitError("Please select at least one location using map or region");
      return false;
    }
    if (!singleTime && !multipleTime) {
      setSubmitError("Please select Ad Period option");
      return false;
    }
    if (multipleTime && !Object.values(timeOptions).some(Boolean)) {
      setSubmitError("Please select at least one time option");
      return false;
    }
    if (!form.viewPlan) {
      setSubmitError("Please select a View Plan");
      return false;
    }
    setSubmitError("");
    return true;
  };

  // Search location/pincode with debounce
  const handleClick = () => {
    navigate(`/userhome/${id}`);
  };
  const searchPlace = async (query) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const newPins = data.map((place) => ({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          name: place.display_name,
          radiusKm: 30,
        }));

        // Filter out duplicates
        const filteredPins = newPins.filter(
          (newPin) =>
            !positions.some((p) => p.lat === newPin.lat && p.lng === newPin.lng)
        );

        if (filteredPins.length > 0) {
          setPositions((prev) => [...prev, ...filteredPins]);
        }
      }
    } catch (error) {
      console.error("Geocode error:", error);
    }
    setLoading(false);
  };

  // Submit form data
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");
    const locationPayload = positions.map((p) => ({
      coords: `${p.lat},${p.lng}`,
      radius: p.radiusKm,
    }));
    const formData = new FormData();

    formData.append("title", form.adName);
    formData.append("description", form.adCategory);
    formData.append("userViewsNeeded", form.viewPlan);

    // Array of positions (e.g., { coords: "8.5,76.9", radius: "5" })
    formData.append("locations", JSON.stringify(locationPayload));
    // Arrays of states and districts
    formData.append("states", JSON.stringify(form.state));
    // if array
    formData.append("districts", JSON.stringify(form.city || []));
    // if array
    formData.append("imageAd", image);
    formData.append("audioAd", audio);

    formData.append(
      "adPeriod",
      JSON.stringify(singleTime ? 0 : selectedTimeSlots)
    );

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/ads/image-ad/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log(response);

        setForm({
          adName: "",
          adCategory: "",
          state: [],
          city: [],
          viewPlan: "",
        });
        if (fileInputAudioRef.current) {
          fileInputAudioRef.current.value = null;
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        setPreview(null);
        setPositions([]);
        setSingleTime(false);
        setMultipleTime(false);
        setSelectedTimeSlots([]);
        setSearchInput("");
        setTimeOptions({
          "3hrs": false,
          "6hrs": false,
          "12hrs": false,
          "24hrs": false,
          "48hrs": false,
        }); // adjust keys as per your time options
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate(`/userhome/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setSubmitSuccess("Ad saved successfully!");
      setLoading(false);
    }, 1000);
  };
  const [preview, setPreview] = useState(null);
  const [previewaudio, setPreviewaudio] = useState(null);


  const handleStateChange = (selected) => {
    const selectedStates = selected ? selected.map((opt) => opt.value) : [];
    setForm({ ...form, state: selectedStates, city: [] }); // clear cities when states change
  };
  const isMapSelected = positions.length > 0;
  const isRegionSelected = form.state.length > 0;
  const fileInputRef = useRef(null);
  const fileInputAudioRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className={styles.adFormMain}>
        {/* Ad Name */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Name</h2>
              <input
                className={styles.AdInput}
                type="text"
                placeholder="Name of your Ad"
                name="adName"
                value={form.adName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ad Category */}
          <div className={styles.labelContainer} style={{ marginTop: "20px" }}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Category</h2>
              <select
                className={styles.selectOption}
                name="adCategory"
                value={form.adCategory}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option>Employment</option>
                <option>Small Businesses</option>
                <option>Large Businesses</option>
                <option>Financial Product and Services</option>
                <option>Housing</option>
                <option>Social Issue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Map and Location search */}
        <div
          className={styles.container}
          style={{
            pointerEvents: isRegionSelected ? "none" : "auto",
            opacity: isRegionSelected ? 0.6 : 1,
          }}
        >
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
            {positions.length > 0 && (
              <ChangeView
                center={[positions[0].lat, positions[0].lng]}
                zoom={13}
              />
            )}
          </MapContainer>

          <h3 className={styles.heading}>Search Location / Pincode</h3>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Enter place or pincode"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 15px",
                fontSize: 16,
                marginBottom: 10,
              }}
            />

            {loading && <p>Searching...</p>}
            <button
              onClick={() => {
                if (searchInput.trim()) searchPlace(searchInput);
              }}
              className={styles.searchBtn}
              disabled={loading}
            >
              Add Pin
            </button>
          </div>

          <h3 className={styles.heading}>Selected Pins</h3>

          {/* List of pins with radius and remove button */}
          <div className={styles.positionsList}>
            {positions.map((pos, index) => (
              <div key={index} className={styles.result}>
                <p>
                  Lat: {pos.lat.toFixed(4)}, Lng: {pos.lng.toFixed(4)}{" "}
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
                  value={pos.radiusKm || ""}
                  placeholder="Radius (km)"
                  onChange={(e) => handleRadiusChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div
          className={styles.adName}
          style={{
            marginTop: "30px",
            pointerEvents: isMapSelected ? "none" : "auto",
            opacity: isMapSelected ? 0.6 : 1,
          }}
        >
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Region</h2>
            </div>
          </div>

          <div
            className={styles.labelContainer}
            style={{ marginTop: "30px", flexDirection: "column" }}
          >
            <div className={styles.AdNameHead}>
              <p>State</p>
              <Select
                isMulti
                options={Object.keys(stateCityMap).map((state) => ({
                  value: state,
                  label: state,
                }))}
                value={Object.keys(stateCityMap)
                  .filter((state) => form.state.includes(state))
                  .map((state) => ({ value: state, label: state }))}
                onChange={handleStateChange}
                className={styles.selectOption}
              />
            </div>
            <div className={styles.selectedStates}>
              {form.state.map((s, index) => (
                <span key={index} className={styles.cityTag}>
                  {s}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        state: prev.state.filter((state) => state !== s),
                      }))
                    }
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div
            className={styles.labelContainer}
            style={{ marginTop: "20px", flexDirection: "column" }}
          >
            <div className={styles.AdNameHead}>
              <p>District</p>
              <Select
                isMulti
                options={cityOptions}
                value={cityOptions.filter((opt) =>
                  form.city.includes(opt.value)
                )}
                onChange={(selected) => {
                  const selectedCities = selected
                    ? selected.map((opt) => opt.value)
                    : [];
                  setForm({ ...form, city: selectedCities });
                }}
                className={styles.selectOption}
              />
            </div>
            <div className={styles.selectedCities}>
              {form.city.map((c, index) => (
                <span key={index} className={styles.cityTag}>
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCity(c)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ad Period */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Period</h2>

              {/* Single Time Option */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <input
                  type="checkbox"
                  checked={singleTime}
                  onChange={() => {
                    const newValue = !singleTime;
                    setSingleTime(newValue);
                    if (newValue) {
                      setMultipleTime(false);
                      setSelectedTimeSlots([]);
                      setTimeOptions({
                        "3hrs": false,
                        "6hrs": false,
                        "12hrs": false,
                        "24hrs": false,
                        "48hrs": false,
                      });
                    }
                  }}
                />
                <label>Single user single time</label>
              </div>

              {/* Multiple Time Option */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <input
                  type="checkbox"
                  checked={multipleTime}
                  onChange={() => {
                    const newValue = !multipleTime;
                    setMultipleTime(newValue);
                    if (newValue) {
                      setSingleTime(false);
                    } else {
                      setSelectedTimeSlots([]);
                      setTimeOptions({
                        "3hrs": false,
                        "6hrs": false,
                        "12hrs": false,
                        "24hrs": false,
                        "48hrs": false,
                      });
                    }
                  }}
                />
                <label>Single user multiple time</label>
              </div>

              {/* Time Slot Selection */}
              {["3hrs", "6hrs", "12hrs", "24hrs", "48hrs"].map((timeLabel) => (
                <div
                  key={timeLabel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "15px",
                    marginLeft: "25px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={timeOptions[timeLabel]}
                    onChange={() => handleTimeChange(timeLabel)}
                    disabled={!multipleTime}
                  />
                  <label>{timeLabel}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Your Ad Photo</h2>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className={styles.previewImg}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Your Voice Not</h2>
              <input
                type="file"
                ref={fileInputAudioRef}
                accept="audio/*"
                onChange={handleFileChangeaudio}
              />
              {previewaudio && (
                <audio controls>
                  <source src={previewaudio} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        </div>
        {/* View Required */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>View Required</h2>
              <select
                className={styles.selectOption}
                style={{ marginTop: "20px" }}
                required
                value={form.viewPlan}
                onChange={handleChange}
                name="viewPlan"
              >
                <option value="">Select Your Plan</option>
                <option value="200">200 views 120 Star</option>
                <option value="400">400 views 240 Star</option>
                <option value="800">800 views 480 Star</option>
                <option value="1600">1600 views 960 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error & Success messages */}
        {submitError && (
          <p style={{ color: "red", marginTop: "10px" }}>{submitError}</p>
        )}
        {submitSuccess && (
          <p style={{ color: "green", marginTop: "10px" }}>{submitSuccess}</p>
        )}

        {/* Buttons */}
        <div className={styles.buttondiv}>
          <div className={styles.mobdiv}>
            <button className={styles.backButton} onClick={handleClick}>
              Back
            </button>
            <button
              style={{
                backgroundColor: "#3563E9",
                border: "none",
                color: "white",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </div>
        {showSuccessPopup && (
          <div className={styles.popupContainer}>
            <Lottie
              animationData={successAnimation}
              loop={false}
              autoplay
              style={{ width: 150, height: 150 }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default AdForm;
