import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Preview from "./Components/Preview";

function App() {
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState("");
  const [profession, setProfession] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setoldPassword] = useState("");
  const [currPassword, setcurrPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/country/countries") // Adjust URL if needed
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched country data:", data);
        setCountries(data);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedState("");
    setSelectedCity("");
    const country = countries.find((c) => c.name === countryName);
    setStates(country ? country.states : []);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedCity("");
    const state = states.find((s) => s.name === stateName);
    setCities(state ? state.cities : []);
  };

  const handleClick = (e) => {
    e.preventDefault();

    const errors = {};
    if (step == 1) {
      // Validate profile photo
      if (!preview) {
        errors.profilePhoto = "Please upload a profile photo.";
      }

      // Username validation
      if (!username.trim()) {
        errors.username = "Username is required.";
      }

      // Current password validation
      if (!oldPassword) {
        errors.oldPassword = "Current password is required.";
      }

      // New password validation
      if (!currPassword) {
        errors.currPassword = "New password is required.";
      } else if (currPassword.length < 6) {
        errors.currPassword = "Password must be at least 6 characters.";
      }

      // Gender validation
      if (!gender) {
        errors.gender = "Gender is required.";
      }

      // Date of birth validation
      if (!dob) {
        errors.dob = "Date of birth is required.";
      }

      setFieldErrors(errors);

      // If no errors, move to next step
      if (Object.keys(errors).length === 0) {
        setStep(step + 1);
      }
    }
    if (step == 2) {
      if (!profession) {
        errors.profession = "Profession is required.";
      }
      if (!address) {
        errors.address = "Address is required.";
      }
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0) {
        setStep(step + 1);
      }
    }
    if (step == 3) {
      if (!country) {
        errors.country = "Country is required.";
      }
      if (!state) {
        errors.state = "State is required.";
      }
      if (!city) {
        errors.city = "City is required.";
      }
      if (!state) {
        errors.state = "State is required.";
      }
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0) {
        setStep(step + 1);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be 2MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time portion

    if (selectedDate >= today) {
      setFieldErrors((prev) => ({
        ...prev,
        dob: "Date of Birth must be before today",
      }));
      setDob("");
    } else {
      setFieldErrors((prev) => {
        const { dob, ...rest } = prev;
        return rest;
      });
      setDob(e.target.value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlecurrPasswordChange = (e) => {
    const pwd = e.target.value;
    setcurrPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const getFormData = () => ({
    username: username,
    profilePhoto: preview || "",
    oldPassword,
    currPassword,
    dob,
    gender,
    profession,
    companyName: profession === "Entrepreneur" ? companyName.trim() : "",
    address,
    country: selectedCountry,
    state: selectedState,
    city: selectedCity,
    subscriptionPlan,
    newsletter,
  });
  
  const validateFields = () => {
    const errors = {};

    if (!username.trim()) errors.username = "Username is required.";
    if (!oldPassword) errors.oldPassword = "Current password is required.";
    if (!currPassword) errors.currPassword = "New password is required.";
    else if (passwordStrength < 3)
      errors.currPassword =
        "Password is too weak. Use at least 8 characters with uppercase, numbers, and special chars.";

    if (!gender) errors.gender = "Gender is required.";
    if (!dob) errors.dob = "Date of Birth is required.";
    if (!address.trim()) errors.address = "Address is required.";
    if (!selectedCountry) errors.country = "Country selection is required.";
    if (!selectedState) errors.state = "State selection is required.";
    if (!selectedCity) errors.city = "City selection is required.";
    if (!subscriptionPlan)
      errors.subscriptionPlan = "Subscription plan selection is required.";

    if (profession === "Entrepreneur" && !companyName.trim())
      errors.companyName = "Company Name is required for Entrepreneurs.";

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const [matchuser, setMatchUser] = useState(false);

  useEffect(() => {
    if (!username.trim()) {
      setUserSuggestions([]);
      setMatchUser(false); // reset on empty input
      return;
    }

    fetch(
      `http://localhost:3000/api/user/searchuser?username=${encodeURIComponent(
        username
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUserSuggestions(data.users);
          setShowDropdown(true);

          const isMatch = data.users.some(
            (user) => user.username.toLowerCase() === username.toLowerCase()
          );
          setMatchUser(isMatch);
          setShowDropdown(true);
          // alert(matchuser)
        } else {
          setUserSuggestions([]);
          setShowDropdown(false);
          setMatchUser(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching user suggestions:", err);
        setUserSuggestions([]);
        setMatchUser(false);
      });
  }, [username]);

  const[datapreview, setDataPreview]=useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-5 ">
      <h1 className="text-center text-3xl font-extrabold text-gray-900 underline ">
        Update Form
      </h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className={`${
          step === 1 ? "flex" : "hidden"
        } min-h-[600px] transform w-[90%] max-w-xl border border-gray-200 mx-auto items-center justify-center  relative rounded`}
      >
        <div className=" w-full p-9 ">
          <div className="flex flex-col items-start  w-full">
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <label
                htmlFor="profilePhoto"
                className="relative cursor-pointer mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                  <img
                    src={
                      preview ||
                      "https://cdn-icons-png.flaticon.com/256/6522/6522516.png"
                    }
                    required
                    alt="Profile Preview"
                    className="w-full h-full object-cover shadow-gray-400 shadow-2xl"
                  />
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  id="profilePhoto"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500">
                Click image to upload (JPG/PNG only)
              </p>
              <p className="text-red-600 text-sm mt-1 text-center w-full">
                {fieldErrors.profilePhoto}
              </p>
              <br />
            </div>

            <div className="mb-5 w-full relative">
              <input
                type="text"
                placeholder="Enter username"
                className="border-b p-1 py-2 w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {showDropdown && userSuggestions.length > 0 && matchuser && (
                <p className="text-green-600 text-sm mt-1">user exists</p>
              )}
              {showDropdown && userSuggestions.length === 0 && (
                <p className="text-red-600 text-sm mt-1">user not exists</p>
              )}
              {fieldErrors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="w-full mb-5">
              <input
                type="password"
                placeholder="Enter old password"
                className="border-b p-1 py-2 w-full outline-none"
                value={oldPassword}
                onChange={(e) => setoldPassword(e.target.value)}
              />
              {fieldErrors.oldPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.oldPassword}
                </p>
              )}
            </div>
            <div className="w-full mb-5">
              <input
                type="password"
                placeholder="Enter new password"
                value={currPassword}
                onChange={handlecurrPasswordChange}
                className="border-b p-1 py-2 w-full outline-none"
              />
              {fieldErrors.currPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.currPassword}
                </p>
              )}
              {currPassword && (
                <div className="w-full h-2 bg-gray-300 rounded mt-2">
                  <div
                    className={`h-2 rounded transition-all duration-500 ${
                      passwordStrength <= 1
                        ? "bg-red-500"
                        : passwordStrength === 2
                        ? "bg-yellow-400"
                        : passwordStrength >= 3
                        ? "bg-green-500"
                        : ""
                    }`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className=" gap-5 w-full">
              <div className="flex gap-5 ">
                <div className="flex-1">
                  <label className="block  mb-1">Gender</label>
                  <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldErrors.gender && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="flex-1">
                  <label className="block  mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border border-gray-300 rounded outline-none text-gray-500"
                    placeholder="Date of Birth"
                  />
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.dob}</p>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-end mt-5">
              <button
                className=" bg-violet-400 hover:bg-violet-600 hover:text-white p-3 px-8 hover:rounded-xl cursor-pointer"
                onClick={handleClick}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>

      <form
        onSubmit={(e) => e.preventDefault()}
        className={`${
          step === 2 ? "flex" : "hidden"
        } min-h-[550px] w-[90%] max-w-xl border border-gray-200 mx-auto items-center justify-center  relative rounded`}
      >
        <div className=" w-full p-9 flex flex-col gap-8">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Professional Details
          </h2>

          {/* Profession Dropdown */}
          <div className="w-full">
            <label htmlFor="profession" className="block mb-1">
              Profession
            </label>
            <select
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full p-2  border-b outline-none "
            >
              <option value="">Select Profession</option>
              <option value="Student">Student</option>
              <option value="Developer">Developer</option>
              <option value="Entrepreneur">Entrepreneur</option>
            </select>
            {fieldErrors && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.profession}
              </p>
            )}
          </div>

          {/* Company Name - only if Entrepreneur */}
          {profession === "Entrepreneur" && (
            <div className="w-full">
              <label htmlFor="company" className="block mb-1">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full p-2  border-b outline-none "
                required
              />
              {fieldErrors.companyName && (
                <p className="text-red-600 text-sm ">
                  {fieldErrors.companyName}
                </p>
              )}
            </div>
          )}

          {/* Address */}
          <div className="w-full">
            <label htmlFor="address" className="block mb-1">
              Address Line 1
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full p-2  border-b outline-none "
              required
            />
            {fieldErrors.address && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.address}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div>
          <button
            className="absolute bottom-5 left-9 bg-violet-400 hover:bg-violet-600 hover:text-white p-3 px-8 hover:rounded-xl cursor-pointer"
            onClick={() => setStep(1)}
          >
            Previous
          </button>
          <button
            className="absolute bottom-5 right-9 bg-violet-400 hover:bg-violet-600 hover:text-white p-3 px-8 hover:rounded-xl cursor-pointer"
            onClick={handleClick}
          >
            Next
          </button>
        </div>
      </form>

      <div
        className={`${
          step === 3 ? "flex" : "hidden"
        } min-h-[600px] w-[90%] max-w-xl border border-gray-200 mx-auto items-center justify-center  relative rounded`}
      >
        <div className=" w-full p-9 flex flex-col gap-5">
          <h2 className="text-2xl text-center font-semibold mb-4">
            Preferences
          </h2>

          {/* Country */}
          <div className="w-full">
            <label htmlFor="country" className="block mb-1">
              Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full p-2  border-b outline-none "
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country._id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {fieldErrors.country && (
              <p className="text-red-600 text-sm ">{fieldErrors.country}</p>
            )}
          </div>

          {/* State */}
          <div className="w-full">
            <label htmlFor="state" className="block mb-1">
              State
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
              disabled={!selectedCountry}
              className="w-full p-2  border-b outline-none "
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {fieldErrors.state && (
              <p className="text-red-600 text-sm ">{fieldErrors.state}</p>
            )}
          </div>

          {/* City */}
          <div className="w-full">
            <label htmlFor="city" className="block mb-1">
              City
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedState}
              className="w-full p-2 border-b outline-none"
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city.name || city}>
                  {city.name || city}
                </option>
              ))}
            </select>
            {fieldErrors.city && (
              <p className="text-red-600 text-sm ">{fieldErrors.city}</p>
            )}
          </div>

          <div className="">
            <label className="block mb-2 font-medium">Subscription Plan</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value="Basic"
                  className="accent-blue-500"
                />
                Basic
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value="Pro"
                  className="accent-blue-500"
                />
                Pro
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value="Enterprise"
                  className="accent-blue-500"
                />
                Enterprise
              </label>
            </div>
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={() => setNewsletter(!newsletter)}
                className="accent-white border border-black w-6"
              />
              Subscribe to newsletter
            </label>
          </div>
          {/* {error && (
            <p className="text-red-600 font-semibold text-center">{error}</p>
          )} */}
          <div className="w-full flex justify-between">
            <button
              className=" bg-violet-400 hover:bg-violet-600 hover:text-white p-3 px-8 hover:rounded-xl cursor-pointer"
              onClick={() => setStep(2)}
            >
              Previous
            </button>
            <button
              className=" bg-violet-400 hover:bg-violet-600 hover:text-white p-3 px-8 hover:rounded-xl cursor-pointer"
              title="preview" onClick={()=>{
                setDataPreview(true)
              }}
            >
              Preview
            </button>
          </div>
        </div>
      </div>
      {datapreview && (
        <Preview
          formData={getFormData()}
          onClose={() => setDataPreview(false)}
        />
      )}
    </div>
  );
}

export default App;
