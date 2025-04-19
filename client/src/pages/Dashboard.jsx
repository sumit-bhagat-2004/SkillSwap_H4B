import React, { useState } from "react";
import ActiveExchanges from "../components/ActiveExchanges";
import Messages from "../components/Messages";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("exchanges");

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Dashboard
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("exchanges")}
                className={`${
                  activeTab === "exchanges"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Active Exchanges
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`${
                  activeTab === "messages"
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Messages
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "exchanges" ? <ActiveExchanges /> : <Messages />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
