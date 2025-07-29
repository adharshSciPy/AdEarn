import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./form2.module.css";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Form2() {
  const navigate = useNavigate();
  const id = useSelector((state) => state.user.id);

  const [form, setForm] = useState({
    fieldOfIntrest: "",
    subcategory: "",
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

  const subCategoryList = {
    Entertainment: ["Movies", "Tvshows", "Music", "Comedy&Mems", "OnlineStreaming"],
    SocialMedia: ["Facebook", "Instagram", "Twitter/X", "LinkedIn", "Snapchat", "Reddit", "TikTok", "YouTube", "Pinterest", "Threads"],
    Lifestyle: ["Fashion&Style", "Food&Cooking", "HomeDecor", "Beauty&Grooming", "Relationships", "Parenting", "Pets&Animals", "Hobbies&Crafts"],
    HealthFitness: ["Nutrition&Diet", "Gymworkouts", "Yoga&Meditation", "MentalHealth", "WeightLoss", "Bodybuilding", "PersonalHealthTracking", "WellnessTips"],
    Finance: ["PersonalBudgeting", "Savings&Investments", "CreditCards&Loans", "Crypto&NFTs", "TaxPlanning", "StockMarket", "Insurance", "RealEstateInvestment"],
    Automobile: ["Cars", "Bikes", "ElectricVehicles", "CarAccessories", "MaintenanceTips", "CarReviews", "Driving&Safety", "AutoShows"],
    SportsGames: ["Football/Soccer", "Cricket", "Basketball", "Tennis", "eSports", "FantasySports", "OutdoorGames", "Board&CardGames"],
    WorkEducation: ["OnlineCourses", "CareerGuidance", "JobSearch", "Freelancing", "Certifications", "StudyTips", "ResumeBuilding", "Internships"],
    MobilePhones: ["Android", "iOS", "MobileReviews", "Accessories", "Tips&Tricks", "MobileApps", "CustomROMs", "UnboxingVideos"],
    TechnologyAI: ["Gadgets", "Programming", "ArtificialIntelligence", "Cybersecurity", "Blockchain", "WebDevelopment", "CloudComputing", "Robotics"],
    Business: ["Startups", "Entrepreneurship", "Marketing&Sales", "E-commerce", "HR&Recruitment", "CompanyProfiles", "BusinessNews", "ProductManageme"],
    Travel: ["DomesticDestinations", "InternationalTrips", "TravelTips", "AdventureTravel", "Hotels&Stays", "Food&Culture", "BudgetTravel", "TravelVlogs"],
  };

  const professionList = [
    "Agriculture/Farming",
    "Business/Self-Employed",
    "Government Service",
    "Private Sector",
    "IT Professional",
    "Healthcare (Doctor/Nurse/Pharmacist)",
    "Engineer",
    "Teacher/Education Professional",
    "Lawyer",
    "Police/Defense",
    "Skilled Labor (Electrician/Plumber/etc.)",
    "Unskilled Labor",
    "Student",
    "Homemaker",
    "Retired",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    
    try {
      const response = await axios.patch(`${baseUrl}/api/v1/user/update/${id}`, form);
      if (response.status === 200) {
        console.log("Submitted Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    setForm({
      fieldOfIntrest: "",
      subcategory: "",
      highestEducation: "",
      profession: "",
      employedIn: "",
    });
  };

  return (
    <div>
      <div className={styles.containerOneUser}>
        <div className={styles.containerSubUser}>
          <div className={styles.containerTwoLeft}>
            <div className={styles.leftMain}>
              <div className={styles.logoContainer}>
                <div className={styles.logo}>
                  <img src={logo} alt="logo" />
                </div>
              </div>
              <div className={styles.contentsContainerLeft}>
                <div className={styles.contentsMainLeft}>
                  <div className={styles.headingMain}>
                    <h2>Welcome Back</h2>
                  </div>
                  <div className={styles.paraContent}>
                    <p>This is a demo content</p>
                  </div>
                  <div className={styles.formContainer}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div>
                        <label className={styles.label} style={{ marginTop: "20px" }}>
                          Field Of Interest
                        </label>
                        <div className={styles.inputGroup}>
                          <select
                            className={styles.input}
                            required
                            value={form.fieldOfIntrest}
                            onChange={handleChange}
                            name="fieldOfIntrest"
                          >
                            <option>Select Your option</option>
                            {Object.keys(subCategoryList).map((key) => (
                              <option key={key} value={key}>
                                {key}
                              </option>
                            ))}
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={styles.label} style={{ marginTop: "20px" }}>
                          Sub Category
                        </label>
                        <select
                          className={styles.input}
                          required
                          name="subcategory"
                          value={form.subcategory}
                          onChange={handleChange}
                          style={{ marginBottom: "10px" }}
                        >
                          <option value="">Select Sub Category</option>
                          {(subCategoryList[form.fieldOfIntrest] || []).map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                              {subCategory}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="highestEducation" className={styles.label}>
                          Highest Education
                        </label>
                        <select
                          name="highestEducation"
                          required
                          className={styles.input}
                          value={form.highestEducation}
                          onChange={handleChange}
                          style={{ marginBottom: "10px" }}
                        >
                          <option>Select Your Highest Education</option>
                          <option value="Below 10">Below 10th</option>
                          <option value="10th">10th (SSLC/Matriculation)</option>
                          <option value="12th Science">12th - Science</option>
                          <option value="12th Humanities">12th - Humanities</option>
                          <option value="12th Commerce">12th - Commerce</option>
                          <option value="Diploma">Diploma</option>
                          <option value="BSc">BSc (Bachelor of Science)</option>
                          <option value="BA">BA (Bachelor of Arts)</option>
                          <option value="BCom">BCom (Bachelor of Commerce)</option>
                          <option value="BTech">BTech (Bachelor of Technology)</option>
                          <option value="BE">BE (Bachelor of Engineering)</option>
                          <option value="BBA">BBA (Bachelor of Business Administration)</option>
                          <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                          <option value="LLB">LLB (Bachelor of Law)</option>
                          <option value="MBBS">MBBS (Bachelor of Medicine & Surgery)</option>
                          <option value="BPharm">BPharm (Bachelor of Pharmacy)</option>
                          <option value="BDS">BDS (Bachelor of Dental Surgery)</option>
                          <option value="MSC">MSc (Master of Science)</option>
                          <option value="MA">MA (Master of Arts)</option>
                          <option value="MCom">MCom (Master of Commerce)</option>
                          <option value="MTech">MTech (Master of Technology)</option>
                          <option value="ME">ME (Master of Engineering)</option>
                          <option value="MBA">MBA (Master of Business Administration)</option>
                          <option value="MCA">MCA (Master of Computer Applications)</option>
                          <option value="LLM">LLM (Master of Law)</option>
                          <option value="MD">MD (Doctor of Medicine)</option>
                          <option value="MS">MS (Master of Surgery)</option>
                          <option value="MPhil">MPhil (Master of Philosophy)</option>
                          <option value="PhD">PhD (Doctorate)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="profession" className={styles.label}>
                          Profession
                        </label>
                        <select
                          className={styles.input}
                          required
                          value={form.profession}
                          onChange={handleChange}
                          name="profession"
                        >
                          <option>Select Your Profession</option>
                          {professionList.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="employedIn" className={styles.label}>
                          Employed In
                        </label>
                        <input
                          id="location"
                          name="employedIn"
                          placeholder="Enter your organization/company"
                          required
                          className={styles.input}
                          value={form.employedIn}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.buttonContainer}>
                        <button type="submit">Continue</button>
                      </div>
                    </form>
                  </div>
                  <div className={styles.scrollContainer}>
                    * scroll down for submission
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bgContainer}></div>
          </div>
          <div className={styles.containerTwoRight}>
            <div className={styles.rightMain}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form2;
