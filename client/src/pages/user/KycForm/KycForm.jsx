import React, { useState } from "react";
import styles from "./Kyc.module.css";
import Navbar from "../NavBar/Navbar";

function KycForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    guardianName: "",
    email: "",
    phone: "",
    permanentAddress: "",
    currentAddress: "",
    document: null,
    bankName: "",
    accountNumber: "",
    ifsc: "",
    state: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const stateCityMap = {Kerala: [
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
  };

  const cityOptions = form.state ? stateCityMap[form.state] || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // Handle form submission logic here
  };

  return (
    <>
    <Navbar/>
    <div className={styles.mainUserContainer}>
      <div className={styles.profileWrapper}>
        <div className={styles.editformHeading}>
          <h2>KYC Form</h2>
        </div>
        <form className={styles.profileCard} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your Full Name" />

            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />

            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                  }}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label>Nationality</label>
            <input type="text" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" />

            <label>Guardian Name</label>
            <input type="text" name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Guardian Name" />

            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />

            <label>Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />

            <label>Permanent Address</label>
            <input type="text" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Permanent Address" />

            <label>Current Address</label>
            <input type="text" name="currentAddress" value={form.currentAddress} onChange={handleChange} placeholder="Current Address" />

            <label>State</label>
            <select name="state" value={form.state} onChange={handleChange} style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                  }}>
              <option value="">Select State</option>
              {Object.keys(stateCityMap).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <label>City</label>
            <select name="city" value={form.city} onChange={handleChange} disabled={!form.state} style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                  }}>
              <option value="">Select City</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <label>Document Proof</label>
            <input type="file" name="document" onChange={handleChange} />

            <label>Bank Name</label>
            <input type="text" name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" />

            <label>Account Number</label>
            <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number" />

            <label>IFSC Code</label>
            <input type="text" name="ifsc" value={form.ifsc} onChange={handleChange} placeholder="IFSC Code" />

            <div className={styles.buttonContainer}>
              <button type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default KycForm;
