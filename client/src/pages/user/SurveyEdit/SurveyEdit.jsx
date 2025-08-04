import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import baseUrl from "../../../baseurl";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/sucess.json";
import { useNavigate } from "react-router-dom";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
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
import styles from "./surveyedit.module.css";
import tickAd from "../../../assets/tickAd.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
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
function SurveyEdit() {
  const userId = useSelector((state) => state.user.id);
  const { id } = useParams();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const location = useLocation();
  const isEditMode = Boolean(id);
  const userToken = useSelector((state) => state.user.token);
  const isDuplicateMode = Boolean(location.state?.duplicatedAd);
  const duplicatedAd = location.state?.duplicatedAd || null;
  const [singleTime, setSingleTime] = useState(false);
  const [multipleTime, setMultipleTime] = useState(false);
  const [timeOptions, setTimeOptions] = useState({
    "3hrs": false,
    "6hrs": false,
    "12hrs": false,
    "24hrs": false,
    "48hrs": false,
  });
  const [form, setForm] = useState({
    state: [],
    city: [],
    viewPlan: "",
    adName: "",
    adCategory: "",
  });
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [allYesNoQuestions, setAllYesNoQuestions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [questionType, setQuestionType] = useState("yesno");
  const [mcQuestion, setMcQuestion] = useState("");
  const [mcOptions, setMcOptions] = useState([]);
  const [allMCQuestions, setAllMCQuestions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...mcOptions];
    updatedOptions[index] = value;
    setMcOptions(updatedOptions);
  };
  const addOption = () => {
    setMcOptions([...mcOptions, ""]);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const addYesNoQuestion = () => {
    if (yesNoQuestion.trim()) {
      setAllYesNoQuestions([...allYesNoQuestions, yesNoQuestion]);
      setYesNoQuestion("");
    }
  };
  const removeOption = (index) => {
    const updatedOptions = mcOptions.filter((_, i) => i !== index);
    setMcOptions(updatedOptions);
  };
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
  const addMCQuestion = () => {
    if (mcQuestion.trim() && mcOptions.every((opt) => opt.trim())) {
      const newQuestion = {
        question: mcQuestion,
        options: mcOptions,
      };
      setAllMCQuestions([...allMCQuestions, newQuestion]);
      setMcQuestion("");
      setMcOptions([]);
    }
  };

  const deleteMCQuestion = (index) => {
    setAllMCQuestions(allMCQuestions.filter((_, i) => i !== index));
  };
  const deleteYesNoQuestion = (index) => {
    setAllYesNoQuestions(allYesNoQuestions.filter((_, i) => i !== index));
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
  useEffect(() => {
    // Normalize source ad: edit fetch > duplicated surveyAd in location.state > duplicatedAd fallback
    const sourceAd = (() => {
      if (isEditMode) return null; // we'll fetch for edit
      if (location.state?.surveyAd) return location.state.surveyAd;
      if (duplicatedAd) return duplicatedAd;
      return null;
    })();

    const initFormFromData = (data) => {
      const adRef =
        data.imgAdRef || data.videoAdRef || data.surveyAdRef || data;

      setForm({
        adName: adRef.title || "",
        adCategory: adRef.category || "",
        description: adRef.description || "",
        state: Array.isArray(adRef.targetStates) ? adRef.targetStates : [],
        city: Array.isArray(adRef.targetDistricts) ? adRef.targetDistricts : [],
        viewPlan: adRef.userViewsNeeded?.toString() || "",
      });

      // Image / preview logic: survey ad uses imageUrl
      if (adRef.imageUrl) {
        setImagePreview(`${baseUrl}${adRef.imageUrl}`);
      } else if (adRef.videoUrl) {
        setPreview(`${baseUrl}${adRef.videoUrl}`);
      }

      // Questions
      if (Array.isArray(adRef.questions)) {
        const yesNoQuestions = [];
        const mcQuestions = [];

        adRef.questions.forEach((q) => {
          if (q.questionType === "yesno") {
            yesNoQuestions.push(q.questionText);
          } else if (q.questionType === "multiple") {
            mcQuestions.push({
              question: q.questionText,
              options: q.options,
            });
          }
        });

        setAllYesNoQuestions(yesNoQuestions);
        setAllMCQuestions(mcQuestions);

        if (yesNoQuestions.length > 0) {
          setQuestionType("yesno");
        } else if (mcQuestions.length > 0) {
          setQuestionType("multiple");
        }
      }

      // Regions / Pins
      setPositions(
        (adRef.targetRegions || []).map((region) => {
          const coords = region?.location?.coordinates || [0, 0];
          return {
            lat: coords[0],
            lng: coords[1],
            radiusKm: region.radiusKm || 30,
          };
        })
      );

      // Ad Period
      const adPeriod = adRef.adPeriod;
      if (adPeriod === 0) {
        setSingleTime(true);
        setMultipleTime(false);
        setSelectedTimeSlots([]);
        setTimeOptions({
          "3hrs": false,
          "6hrs": false,
          "12hrs": false,
          "24hrs": false,
          "48hrs": false,
        });
      } else if (adPeriod > 0) {
        setSingleTime(false);
        setMultipleTime(true);
        setSelectedTimeSlots(adPeriod);

        const timeOptionsMap = {
          3: "3hrs",
          6: "6hrs",
          12: "12hrs",
          24: "24hrs",
          48: "48hrs",
        };
        const selectedOption = timeOptionsMap[adPeriod];
        setTimeOptions({
          "3hrs": selectedOption === "3hrs",
          "6hrs": selectedOption === "6hrs",
          "12hrs": selectedOption === "12hrs",
          "24hrs": selectedOption === "24hrs",
          "48hrs": selectedOption === "48hrs",
        });
      }
    };

    const fetchAdData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/user/my-single-ad/${userId}/${id}`
        );
        const adData = response.data.ad;
        initFormFromData(adData);
      } catch (error) {
        console.error("Failed to fetch ad:", error);
      }
    };

    if (isEditMode) {
      fetchAdData();
    } else if (sourceAd) {
      initFormFromData(sourceAd);
    }
  }, [id, userId, location.state, duplicatedAd, isEditMode]);

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
      const res = await fetch(
        `http://localhost:8000/api/v1/geocode?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const newPins = data.map((place) => ({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          name: place.display_name,
          radiusKm: 30,
        }));

        const filteredPins = newPins.filter(
          (newPin) =>
            !positions.some((p) => p.lat === newPin.lat && p.lng === newPin.lng)
        );

        if (filteredPins.length > 0) {
          setPositions((prev) => [...prev, ...filteredPins]);
        }
      } else {
        alert("No results found.");
      }
    } catch (error) {
      console.error("Geocode error:", error);
      alert("Failed to search location.");
    } finally {
      setLoading(false);
    }
  };

  // Submit form data
  const handleSubmit = async (paymenttype) => {
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    const allQuestions = [];

    if (questionType === "yesno") {
      allYesNoQuestions.forEach((q) =>
        allQuestions.push({
          questionText: q,
          questionType: "yesno",
          options: ["Yes", "No"],
        })
      );
    }

    if (questionType === "multiple") {
      allMCQuestions.forEach((q) =>
        allQuestions.push({
          questionText: q.question,
          questionType: "multiple",
          options: q.options,
        })
      );
    }

    const locationPayload = positions.map((p) => ({
      coords: `${p.lat},${p.lng}`,
      radius: p.radiusKm,
    }));

    const formData = new FormData();
    formData.append("questions", JSON.stringify(allQuestions));
    formData.append("title", form.adName);
    formData.append("description", form.adCategory);
    formData.append("locations", JSON.stringify(locationPayload));
    formData.append("states", JSON.stringify(form.state));
    formData.append("districts", JSON.stringify(form.city || []));
    formData.append(
      "adPeriod",
      JSON.stringify(singleTime ? 0 : selectedTimeSlots)
    );

    // Only append viewPlan during create or duplicate (not edit)
    if (!isEditMode || isDuplicateMode) {
      formData.append("userViewsNeeded", form.viewPlan);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imagePreview && isDuplicateMode) {
      // Handle existing image for duplicate mode
      const relativeImageUrl = imagePreview.startsWith(baseUrl)
        ? imagePreview.substring(baseUrl.length)
        : imagePreview;
      formData.append("existingImageUrl", relativeImageUrl);
    }

    // Conditional method and endpoint based on mode
    const isCreateMode = !isEditMode || isDuplicateMode;

    if (paymenttype === "stars") {
      try {
        let endpoint, method;

        if (isCreateMode) {
          endpoint = `${baseUrl}/api/v1/ads/survey-ad/${userId}`;
          method = "post";
        } else {
          endpoint = `${baseUrl}/api/v1/ads/edit-survey-ad/${id}`;
          method = "patch";
        }

        const response = await axios[method](endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          // Clear form and show success
          setForm({
            adName: "",
            adCategory: "",
            state: [],
            city: [],
            viewPlan: "",
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          setImagePreview(null);
          setImageFile(null);
          setPositions([]);
          setSingleTime(false);
          setMultipleTime(false);
          setSelectedTimeSlots([]);
          setSearchInput("");
          setAllYesNoQuestions([]);
          setAllMCQuestions([]);
          setTimeOptions({
            "3hrs": false,
            "6hrs": false,
            "12hrs": false,
            "24hrs": false,
            "48hrs": false,
          });

          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
            navigate(`/userhome/${userId}`); // Use userId instead of id
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setSubmitError("Failed to save ad. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (paymenttype === "payment") {
      try {
        let endpoint, method;

        if (isCreateMode) {
          endpoint = `${baseUrl}/api/v1/ads/survey-ad/draft/${userId}`;
          method = "post";
        } else {
          endpoint = `${baseUrl}/api/v1/ads/edit-survey-ad/draft/${id}`;
          method = "patch";
        }

        const response = await axios[method](endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          // Same cleanup as above
          setForm({
            adName: "",
            adCategory: "",
            state: [],
            city: [],
            viewPlan: "",
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          setImagePreview(null);
          setImageFile(null);
          setPositions([]);
          setSingleTime(false);
          setMultipleTime(false);
          setSelectedTimeSlots([]);
          setSearchInput("");
          setAllYesNoQuestions([]);
          setAllMCQuestions([]);
          setTimeOptions({
            "3hrs": false,
            "6hrs": false,
            "12hrs": false,
            "24hrs": false,
            "48hrs": false,
          });

          setShowSuccessPopup(true);
          setTimeout(() => {
            setShowSuccessPopup(false);
            navigate(`/userhome/${userId}`);
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setSubmitError("Failed to save ad. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const initFormFromData = (data) => {
      const adRef =
        data.imgAdRef || data.videoAdRef || data.surveyAdRef || data;

      setForm({
        adName: adRef.title || "",
        adCategory: adRef.description || "",
        description: adRef.description || "",
        state: Array.isArray(adRef.targetStates) ? adRef.targetStates : [],
        city: Array.isArray(adRef.targetDistricts) ? adRef.targetDistricts : [],
        viewPlan: adRef.userViewsNeeded?.toString() || "",
      });

      // Handle existing image for edit/duplicate
      if (adRef.imageUrl) {
        setImagePreview(`${baseUrl}${adRef.imageUrl}`);
      }

      // Handle existing questions
      if (adRef.questions && Array.isArray(adRef.questions)) {
        const yesNoQuestions = [];
        const mcQuestions = [];

        adRef.questions.forEach((q) => {
          if (q.questionType === "yesno") {
            yesNoQuestions.push(q.questionText);
          } else if (q.questionType === "multiple") {
            mcQuestions.push({
              question: q.questionText,
              options: q.options,
            });
          }
        });

        setAllYesNoQuestions(yesNoQuestions);
        setAllMCQuestions(mcQuestions);

        // Set question type based on existing questions
        if (yesNoQuestions.length > 0) {
          setQuestionType("yesno");
        } else if (mcQuestions.length > 0) {
          setQuestionType("multiple");
        }
      }

      setPositions(
        (adRef.targetRegions || []).map((region) => {
          const coords = region?.location?.coordinates || [0, 0];
          return {
            lat: coords[0],
            lng: coords[1],
            radiusKm: region.radiusKm || 30,
          };
        })
      );

      // Handle Ad Period Logic
      const adPeriod = adRef.adPeriod;

      if (adPeriod === 0) {
        setSingleTime(true);
        setMultipleTime(false);
        setSelectedTimeSlots([]);
        setTimeOptions({
          "3hrs": false,
          "6hrs": false,
          "12hrs": false,
          "24hrs": false,
          "48hrs": false,
        });
      } else if (adPeriod > 0) {
        setSingleTime(false);
        setMultipleTime(true);
        setSelectedTimeSlots(adPeriod);

        const timeOptionsMap = {
          3: "3hrs",
          6: "6hrs",
          12: "12hrs",
          24: "24hrs",
          48: "48hrs",
        };

        const selectedOption = timeOptionsMap[adPeriod];

        setTimeOptions({
          "3hrs": selectedOption === "3hrs",
          "6hrs": selectedOption === "6hrs",
          "12hrs": selectedOption === "12hrs",
          "24hrs": selectedOption === "24hrs",
          "48hrs": selectedOption === "48hrs",
        });
      }
    };

    const fetchAdData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/user/my-single-ad/${userId}/${id}`
        );
        const adData = response.data.ad;
        initFormFromData(adData);
      } catch (error) {
        console.error("Failed to fetch ad:", error);
      }
    };

    if (isEditMode) {
      fetchAdData();
    } else if (duplicatedAd) {
      initFormFromData(duplicatedAd);
    }
  }, [id, userId, duplicatedAd, isEditMode, isDuplicateMode]);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleStateChange = (selected) => {
    const selectedStates = selected ? selected.map((opt) => opt.value) : [];
    setForm({ ...form, state: selectedStates, city: [] }); // clear cities when states change
  };
  const isMapSelected = positions.length > 0;
  const isRegionSelected = form.state.length > 0;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle tour completion

  //driver.js

  // Start home tour when navbar tour is completed
  useEffect(() => {
    const homeTourDone = localStorage.getItem(`userTourCompleted_${id}`);
    const surveyadsCompleted = localStorage.getItem(
      `surveyAdTourCompleted_${id}`
    );

    // Start home tour if navbar is done but full tour isn't complete
    if (homeTourDone && !surveyadsCompleted) {
      // Add a small delay to ensure all elements are rendered
      setTimeout(() => {
        startHomeTour();
      }, 500);
    }
  }, [id]); // Remove tourState.navbarCompleted dependency

  // Also trigger when navbar completes via callback

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
            <div className={styles.AdNameHead} id="ads-name">
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
            <div className={styles.AdNameHead} id="select-ads-category">
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
          id="select-ads-location"
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
          id="select-ads-region"
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
            <div className={styles.AdNameHead} id="select-ads-period">
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
          <div className={styles.labelContainer} id="survey-ads-add">
            <div className={styles.labelImg}>
              <img src={tickAd} alt="tick" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Your Survey Ad</h2>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    checked={questionType === "yesno"}
                    onChange={() => setQuestionType("yesno")}
                  />
                  Yes or No Questions
                </label>
                <label>
                  <input
                    type="radio"
                    checked={questionType === "multiple"}
                    onChange={() => setQuestionType("multiple")}
                  />
                  Multiple Choice Questions
                </label>
              </div>
            </div>
            {/* Yes/No UI */}
            {questionType === "yesno" && (
              <div className={styles.section}>
                <label className={styles.label}>Yes/No Question</label>
                <input
                  type="text"
                  value={yesNoQuestion}
                  onChange={(e) => setYesNoQuestion(e.target.value)}
                  placeholder="Enter your Yes/No question"
                  className={styles.input}
                />
                <button onClick={addYesNoQuestion} className={styles.button}>
                  Add Question
                </button>
                <p className={styles.note}>
                  <strong>Note:</strong> Yes/No questions do not require
                  options.
                </p>
                <div style={{ marginTop: "20px" }}>
                  {allYesNoQuestions.map((q, i) => (
                    <div key={i} className={styles.questionContainer}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <strong>Q{i + 1}:</strong> {q}
                        </div>
                        <button
                          onClick={() => deleteYesNoQuestion(i)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* MCQ UI */}
            {questionType === "multiple" && (
              <div className={styles.section}>
                <label className={styles.label}>Multiple Choice Question</label>
                <input
                  type="text"
                  value={mcQuestion}
                  onChange={(e) => setMcQuestion(e.target.value)}
                  placeholder="Enter your multiple choice question"
                  className={styles.input}
                />
                {mcOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className={styles.input}
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => removeOption(idx)}
                      className={styles.deleteButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button onClick={addOption} className={styles.addOptionButton}>
                  ➕ Add Option
                </button>
                <button onClick={addMCQuestion} className={styles.button}>
                  Add Question
                </button>
                <div style={{ marginTop: "20px" }}>
                  {allMCQuestions.map((q, i) => (
                    <div key={i} className={styles.questionContainer}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <strong>Q{i + 1}:</strong> {q.question}
                        </div>
                        <button
                          onClick={() => deleteMCQuestion(i)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                      <ul style={{ marginTop: "5px" }}>
                        {q.options.map((o, j) => (
                          <li key={j}>- {o}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* File Upload */}
            <div className={styles.section}>
              <label className={styles.label}>Ad Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "200px", borderRadius: "8px" }}
                  />
                </div>
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
            <div className={styles.AdNameHead} id="view-requirement">
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
              onClick={() => setShowPaymentModal(true)}
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
        {showPaymentModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Choose Payment Method</h2>
              <p>How would you like to proceed?</p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.paymentBtn}
                  onClick={() => {
                    setSelectedPaymentType("payment");
                    setShowPaymentModal(false);
                    handleSubmit("payment");
                  }}
                >
                  💳 Pay with Payment
                </button>
                <button
                  className={styles.starBtn}
                  onClick={() => {
                    setSelectedPaymentType("stars");
                    setShowPaymentModal(false);
                    handleSubmit("stars");
                  }}
                >
                  ⭐ Pay with Stars
                </button>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SurveyEdit;
