import React from "react";
import WhatsAppStatus from "../components/WhatsAppStatus";

const DashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <WhatsAppStatus />
    </div>
  );
};

export default DashboardPage;
