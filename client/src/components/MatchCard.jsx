import React, { useState } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
} from "lucide-react";
import { axiosInstance } from "../lib/axiosInstance";
import { useAuth } from "@clerk/clerk-react";

const MatchCard = ({ match }) => {
  const [expanded, setExpanded] = useState(false);
  const { getToken } = useAuth();

  const handleSkillSwap = async () => {
    try {
      const token = await getToken();
      await axiosInstance.post(
        "/request/send",
        {
          toUserId: match._id,
          skillToLearn: match.skillsWanted?.[0]?.name || "",
          skillToTeach: match.skillsOffered?.[0]?.name || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Request sent!");
    } catch (err) {
      console.error("Skill swap request failed:", err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={match.avatar}
              alt={match.firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {match.firstName}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{match.location}</span>
              </div>

              <div className="flex items-center mt-2">
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <Star size={12} className="mr-1" fill="currentColor" />
                  <span>Match Profile</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-500"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expanded && (
          <>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  🛠 Skills Offered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.skillsOffered?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  🎯 Skills Wanted
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.skillsWanted?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  💼 Experience
                </h4>
                <p className="text-gray-600 text-sm">
                  {match.experience || "Not specified"}
                </p>
                <p className="text-gray-500 text-xs italic">
                  {match.experienceType || ""}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSkillSwap}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
              >
                <MessageSquare size={16} className="mr-2" />
                Contact for Skill Swap
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
