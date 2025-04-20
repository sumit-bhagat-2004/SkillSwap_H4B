import React, { useEffect, useState } from "react";
import { Calendar, Clock, Video, MessageSquare } from "lucide-react";
import { axiosInstance } from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const ActiveExchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchExchanges = async () => {
      const token = await getToken();
      const res = await axiosInstance.get("/exchange/my-exchanges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExchanges(res.data.exchanges);
    };

    fetchExchanges();
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "No session scheduled";
    }

    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(parsedDate);
  };

  if (exchanges.length === 0) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-medium text-gray-900">
          No active exchanges
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Start swapping skills and your exchanges will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Your Skill Exchanges
      </h2>
      <div className="space-y-6">
        {exchanges.map((exchange) => {
          const [me, partner] = exchange.participants;
          return (
            <div
              key={exchange._id}
              className="border border-gray-200 rounded-lg p-5 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={partner.userId.avatar}
                    alt={partner.userId.firstName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {partner.userId.firstName}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-teal-600">
                        You teach:
                      </span>{" "}
                      {me.teaches} •{" "}
                      <span className="font-medium text-purple-600">
                        They teach:
                      </span>{" "}
                      {me.learns}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Next Session
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exchange.nextSession)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/${exchange._id}`}>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
                    <Video size={16} className="mr-2" />
                    Start Session
                  </button>
                </Link>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  <MessageSquare size={16} className="mr-2" />
                  Message
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  <Clock size={16} className="mr-2" />
                  Reschedule
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveExchanges;
