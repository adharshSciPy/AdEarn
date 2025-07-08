import { React, useEffect, useState } from "react";
import styles from "./UserEdit.module.css";
import Avatar from "../../../assets/Avatar.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useSelector } from "react-redux";

function UserProfileEdit() {

  const [data, setData] = useState({})
  const id = useSelector((state) => state.user.id)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    state: "",
    city: "",
    district: "",
    pinCode: "",
    location: "",
    myReferalCode: "",
    fieldOfInterest: "",
    subcategory: "",
    maritalStatus: "",
    highestEducation: "",
    profession: "",
    employedIn: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  };

  const submitHandler = async () => {
    try {
      const resposne = await axios.patch(`${baseUrl}/api/v1/user/update/${id}`, form)
      console.log("user edit res", resposne)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(`${baseUrl}/api/v1/admin/single-user/${id}`);
        console.log("getuserbyid", userResponse.data.data)
        setData(userResponse.data.data)
        // 👇 Also update the form state with fetched user data
        setForm((prevForm) => ({
          ...prevForm,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          gender: data.gender || "",
          state: data.state || "",
          city: data.city || "",
          district: data.district || "",
          pinCode: data.pinCode || "",
          location: data.location || "",
          myReferalCode: data.myReferalCode || "",
          fieldOfInterest: data.fieldOfInterest || "",
          subcategory: data.subcategory || "",
          maritalStatus: data.maritalStatus || "",
          highestEducation: data.highestEducation || "",
          profession: data.profession || "",
          employedIn: data.employedIn || "",
        }));
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])

  return (
    <>
      <Navbar />
      <div className={styles.mainUserContainer}>
        <div className={styles.contentsContainer}>
          <div className={styles.firstContent}>
            <div className={styles.firstMain}>
              <div className={styles.firstMainleftContainer}>
                <div className={styles.firstMainHeader}>
                  <h2>Your Wallet</h2>
                </div>
                <div className={styles.firstMainp}>
                  <p>
                    Providing cheap car rental services and safe and comfortable
                    facilities.
                  </p>
                </div>
                <div className={styles.firstMainbutton}>
                  <button>Place Ads</button>
                </div>
              </div>

              <div className={styles.firstMainrightContainer}>
                <div className={styles.firstImageContainer}>
                  <div className={styles.firstImageContainerMain}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileWrapper}>
          <div className={styles.editformHeading}>
            <h2>Profile Edit</h2>
          </div>
          <div className={styles.profileCard}>
            <div className={styles.profileHead}>
              <div className={styles.leftPanel}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.imgWrapper}>
                    <img src={Avatar} alt="" />
                  </div>
                  <div className={styles.detailWrapper}>
                    <div className={styles.nameConatainer}>
                      <h5>{data.firstName}{" "}{data.lastName}</h5>
                    </div>
                    <div className={styles.emailConatainer}>{data.email}</div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input type="text" placeholder="Your First Name" name="firstName" value={form.firstName} onChange={handleChange} />

                  <label>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Your Last Name" />

                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  >
                    <option value="">Gender</option>
                    <option value="Male"> Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" />

                  <label>Password</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Your Password" />

                  <label>State</label>
                  <select
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                    }}
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

                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Your City" />

                  <label>District</label>
                  <input name="district" value={form.district} onChange={handleChange} placeholder="Your District" />

                  <label>Pin Code</label>
                  <input name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="Your Pin Code" />

                
                </div>
              </div>

              <div className={styles.rightPanel}>
                <div className={styles.formGroup}>

                  <label>Referral Code</label>
                  <input name="myReferalCode" value={form.myReferalCode} onChange={handleChange} placeholder="Your Referral Code" />

                  <label>Field of Interest</label>
                  <input name="fieldOfInterest" value={form.fieldOfInterest} onChange={handleChange} placeholder="Your Field Of Interest" />

                  <label>Subcategory</label>
                  <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="Your Sub Category" />

                  <label>Marital Status</label>
                  <input name="maritalStatus" value={form.maritalStatus} onChange={handleChange} placeholder="Your Marital Status" />

                  <label>Highest Education</label>
                  <input name="highestEducation" value={form.highestEducation} onChange={handleChange} placeholder="Your Education" />

                  <label>Profession</label>
                  <input name="profession" value={form.profession} onChange={handleChange} placeholder="Your Profession" />

                  <label>Employed In</label>
                  <input name="employedIn" value={form.employedIn} onChange={handleChange} placeholder="Your Employee" />


                </div>
                <div className={styles.kycWrapper}>
                  <h3>Update your KYC *</h3>
                  <button className={styles.kycButton}>Verify Now</button>
                </div>
                <button className={styles.saveBtn} onClick={submitHandler}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfileEdit;
