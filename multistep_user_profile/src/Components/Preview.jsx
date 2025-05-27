import { useState } from "react";
import axios from "axios";

const Preview = ({ formData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
  
    const {
      username,
      currPassword,
      oldPassword,
      dob,
      gender,
      profession,
      companyName,
      address,
      country,
      state,
      city,
      subscriptionPlan,
      newsletter
    } = formData;
  
    try {
      const response = await fetch("http://localhost:3000/api/user/update-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          currPassword,
          oldPassword,
          dob,
          gender,
          profession,
          companyName,
          address,
          country,
          state,
          city,
          subscriptionPlan,
          newsletter
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update user.");
        return;
      }
  
      const result = await response.json();
      alert("✅ User updated successfully!");
      console.log("Server response:", result);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-[#ffffffda] flex items-center justify-center z-50">
      <div className="max-w-2xl w-[80%] border border-gray-200 mx-auto p-6 bg-white shadow-lg rounded max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Profile Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-5xl cursor-pointer font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-base text-gray-700">
          {formData.profilePhoto && (
            <div className="text-center">
              <img
                src={formData.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border mx-auto"
              />
            </div>
          )}
          <div><strong>Username:</strong> {formData.username || 'N/A'}</div>
          <div><strong>Current Password:</strong> {formData.currPassword || 'N/A'}</div>
          <div><strong>Old Password:</strong> {formData.oldPassword || 'N/A'}</div>
          <div><strong>Date of Birth:</strong> {formData.dob || 'N/A'}</div>
          <div><strong>Gender:</strong> {formData.gender || 'N/A'}</div>
          <div><strong>Profession:</strong> {formData.profession || 'N/A'}</div>
          {formData.profession === 'Entrepreneur' && (
            <div><strong>Company Name:</strong> {formData.companyName || 'N/A'}</div>
          )}
          <div><strong>Address:</strong> {formData.address || 'N/A'}</div>
          <div><strong>Country:</strong> {formData.country || 'N/A'}</div>
          <div><strong>State:</strong> {formData.state || 'N/A'}</div>
          <div><strong>City:</strong> {formData.city || 'N/A'}</div>
          <div><strong>Subscription Plan:</strong> {formData.subscriptionPlan || 'N/A'}</div>
          <div><strong>Newsletter:</strong> {formData.newsletter ? 'Yes' : 'No'}</div>
        </div>

        {error && <div className="text-red-600 text-center mt-4">{error}</div>}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-600 text-white p-3 px-8 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white p-3 px-8 rounded-xl"
          >
            {loading ? "Submitting..." : "Submit Form"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
