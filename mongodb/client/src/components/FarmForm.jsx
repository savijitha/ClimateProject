import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getUserId = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    return user._id;
  } else {
    return null;
  }
};

const FarmForm = () => {
  const user_id = getUserId();
  const navigate = useNavigate();

  if (user_id) {
    console.log("User ID:", user_id);
  } else {
    console.log("No user found in localStorage.");
  }

  const [formData, setFormData] = useState({
    location: "",
    crop_type: "",
    planting_schedule: "",
    soil_type: "",
    irrigation_system: "",
    size: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear previous messages
    try {
      const response = await axios.post("http://localhost:5000/api/farms", {
        ...formData,
        user_id,
      });
      console.log("Farm data submitted", response.data);
      setSuccessMessage("Farm details saved successfully!");
        setShowPopup(true);
// You can also redirect here if you want:
// navigate('/');

      // You can also redirect here if you want:
      // navigate('/');
    } catch (error) {
      console.error("Error submitting farm data", error);
setSuccessMessage("Failed to save farm details. Please try again.");
setShowPopup(true);

    }
  };
  const closePopup = () => {
  setShowPopup(false);
  setSuccessMessage("");
};


  return (
    <div>
      <style>
        {`
                form {
                    margin: 20px auto;
                    padding: 30px;
                    border: 1px solid #444;
                    border-radius: 10px;
                    max-width: 400px;
                    background-color: #1a1a1a;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    color: white;
                }
                
                input, select, button {
                    display: block;
                    width: 100%;
                    padding: 12px;
                    margin: 15px 0;
                    background-color: #333;
                    color: white;
                    border: 1px solid #555;
                    border-radius: 5px;
                    box-sizing: border-box;
                    font-size: 16px;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                
                input:focus, select:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 8px rgba(0, 123, 255, 0.6);
                }
                
                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 12px;
                    font-size: 16px;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }
                
                button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }
                
                button:disabled {
                    background-color: #555;
                    cursor: not-allowed;
                }
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #ccc;
                }
                
                .error-message {
                    color: #ff4c4c;
                    font-size: 14px;
                    margin-top: 5px;
                }
                
                .success-message {
                    color: #28a745;
                    font-size: 14px;
                    margin-top: 5px;
                    text-align: center;
                }
                
                @media (max-width: 480px) {
                    form {
                        padding: 20px;
                        max-width: 90%;
                    }
                
                    input, select, button {
                        font-size: 14px;
                    }
                
                    button {
                        padding: 10px;
                    }
                }
                    .popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}


                `}
      </style>
      <form onSubmit={handleSubmit}>
        <h2
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "0px",
            marginBottom: "10px",
          }}
        >
          Farm Data Form
        </h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="crop_type">Crop Type:</label>
        <input
          type="text"
          id="crop_type"
          name="crop_type"
          value={formData.crop_type}
          onChange={handleChange}
          required
        />

        <label htmlFor="planting_schedule">Planting Schedule:</label>
        <input
          type="date"
          id="planting_schedule"
          name="planting_schedule"
          value={formData.planting_schedule}
          onChange={handleChange}
          required
        />

        <label htmlFor="soil_type">Soil Type:</label>
        <input
          type="text"
          id="soil_type"
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          required
        />

        <label htmlFor="irrigation_system">Irrigation System:</label>
        <input
          type="text"
          id="irrigation_system"
          name="irrigation_system"
          value={formData.irrigation_system}
          onChange={handleChange}
          required
        />

        <label htmlFor="size">Size (in acres):</label>
        <input
          type="number"
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
      {showPopup && (
  <div className="popup-overlay">
    <div className="popup-content">
      <p className={successMessage.includes("successfully") ? "success-message" : "error-message"}>
        {successMessage}
      </p>
      <button onClick={closePopup}>OK</button>
    </div>
  </div>
)}

    </div>
  );
};

export default FarmForm;
