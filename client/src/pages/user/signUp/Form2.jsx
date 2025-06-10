import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./form2.module.css";

function Form2() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    fieldOfInterest: "",
    subCategory: "",
    
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const subCategoryList = {
    Entertainment: [
      "Movies",
      "Tvshows",
      "Music",
      "Comedy&Mems",
      "OnlineStreaming",
    ],
    SocialMedia: [
      "Facebook",
      "Instagram",
      "Twitter/X",
      "LinkedIn",
      "Snapchat",
      "Reddit",
      "TikTok",
      "YouTube",
      "Pinterest",
      "Threads",
    ],
    Lifestyle: [
      "Fashion&Style",
      "Food&Cooking",
      "HomeDecor",
      "Beauty&Grooming",
      "Relationships",
      "Parenting",
      "Pets&Animals",
      "Hobbies&Crafts",
    ],
    HealthFitness: [
      "Nutrition&Diet",
      "Gymworkouts",
      "Yoga&Meditation",
      "MentalHealth",
      "WeightLoss",
      "Bodybuilding",
      "PersonalHealthTracking",
      "WellnessTips",
    ],
    Finance: [
      "PersonalBudgeting",
      "Savings&Investments",
      "CreditCards&Loans",
      "Crypto&NFTs",
      "TaxPlanning",
      "StockMarket",
      "Insurance",
      "RealEstateInvestment",
    ],
    Automobile: [
      "Cars",
      "Bikes",
      "ElectricVehicles",
      "CarAccessories",
      "MaintenanceTips",
      "CarReviews",
      "Driving&Safety",
      "AutoShows",
    ],
    SportsGames: [
      "Football/Soccer",
      "Cricket",
      "Basketball",
      "Tennis",
      "eSports",
      "FantasySports",
      "OutdoorGames",
      "Board&CardGames",
    ],
    WorkEducation: [
      "OnlineCourses",
      "CareerGuidance",
      "JobSearch",
      "Freelancing",
      "Certifications",
      "StudyTips",
      "ResumeBuilding",
      "Internships",
    ],
    MobilePhones:[
      "Android",
      "iOS",
      "MobileReviews",
      "Accessories",
      "Tips&Tricks",
      "MobileApps",
      "CustomROMs",
      "UnboxingVideos",
    ],
    TechnologyAI: [
      "Gadgets",
      "Programming",
      "ArtificialIntelligence",
      "Cybersecurity",
      "Blockchain",
      "WebDevelopment",
      "CloudComputing",
      "Robotics",
    ],
    Business: [
      "Startups",
      "Entrepreneurship",
      "Marketing&Sales",
      "E-commerce",
      "HR&Recruitment",
      "CompanyProfiles",
      "BusinessNews",
      "ProductManageme",
    ],
    Travel:[
        "DomesticDestinations",
        "InternationalTrips",
        "TravelTips",
        "AdventureTravel",
        "Hotels&Stays",
        "Food&Culture",
        "BudgetTravel",
        "TravelVlogs"
    ]
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted:", form);
    setForm({
      firstName: "",
      lastName: "",
      gender: "",
      state: "",
      city: "",
      pincode: "",
      location: "",
    });
  };
  const renderOptionButtons = (options, selectedOption, setSelectedOption) =>
    options.map((option) => (
      <button
        key={option}
        type="button"
        className={`${styles.optionSingleButton} ${
          selectedOption === option ? styles.selected : ""
        }`}
        onClick={() => setSelectedOption(option)}
      >
        {option}
      </button>
    ));

  return (
    <div>
      <div className={styles.containerOneUser}>
        <div className={styles.containerSubUser}>
          <div className={styles.containerTwoLeft}>
            <div className={styles.leftMain}>
              <div className={styles.logoContainer}>
                <div className={styles.logo}>
                  <img src={logo} alt="" />
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
                        <label
                          htmlFor="fieldOfInterest"
                          className={styles.label}
                          style={{ marginTop: "20px" }}
                        >
                          Field Of Interest
                        </label>
                        <div className={styles.inputGroup}>
                          <select
                            className={styles.input}
                            required
                            value={form.fieldOfInterest || ""}
                            onChange={handleChange}
                            name="fieldOfInterest"
                          >
                            <option>Select Your option</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="SocialMedia">SocialMedia</option>
                            <option value="HealthFitness">HealthFitness</option>
                            <option value="Finance">Finance</option>
                            <option value="Automobile">Automobile</option>
                            <option value="SportsGames">SportsGames</option>
                            <option value="WorkEducation">WorkEducation</option>
                            <option value="MobilePhones">MobilePhones</option>
                            <option value="Technology&AI">Technology&AI</option>
                            <option value="Business">Business</option>
                            <option value="Travel">Travel</option>
                            <option value="Lifestyle">Lifestyle</option>

                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          className={styles.label}
                          style={{ marginTop: "20px" }}
                        >
                          Sub Category
                        </label>
                        <select
                          className={styles.input}
                          required
                          name="subCategory"
                          value={form.subCategory}
                          onChange={handleChange}
                          style={{ marginBottom: "10px" }}
                        >
                          <option value="">Select Sub Category</option>
                          {(subCategoryList[form.fieldOfInterest] || []).map(
                            (subCategory) => (
                              <option key={subCategory} value={subCategory}>
                                {subCategory}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pincode" className={styles.label}>
                          Pincode
                        </label>
                        <input
                          style={{ marginBottom: "10px" }}
                          id="pincode"
                          name="pincode"
                          placeholder="pincode"
                          required
                          className={styles.input}
                          value={form.pincode}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className={styles.label}>
                          Location
                        </label>
                        <input
                          id="location"
                          name="location"
                          placeholder="location"
                          required
                          className={styles.input}
                          value={form.location}
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
