import React, { useState } from "react";
import axios from "../api/api";

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { phoneNumber });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to login.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 bg-gray-100 rounded">
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 font-bold">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
