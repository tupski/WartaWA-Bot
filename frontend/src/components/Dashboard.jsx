import React, { useEffect, useState } from "react";
import axios from "../api/api";

const WhatsAppStatus = () => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("/status");
        setStatus(response.data.status);
      } catch (error) {
        console.error(error);
        setStatus("Error fetching status.");
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold">WhatsApp Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default WhatsAppStatus;
