import React, { useEffect, useState } from "react";
import MatchesList from "../components/MatchesList";
import MatchFilters from "../components/MatchFilters";
import { axiosInstance } from "../lib/axiosInstance";

const Matches = () => {
  const [filters, setFilters] = useState({
    skillCategory: "",
    skillLevel: "",
    location: "",
    matchScore: 0,
  });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async (category = "") => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/user/match-users${category ? `?skill=${category}` : ""}`
      );

      console.log("API Response:", res.data);
      const usersArray = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];

      const fetchedUsers = usersArray.map((user) => ({
        id: user._id,
        firstName: user.firstName || user.name || "No Name",
        avatar: user.avatar || "https://via.placeholder.com/150",
        location: user.location || "Unknown",
        skillsOffered:
          user.skills?.map((skill) => ({
            name: skill,
            level: "Intermediate", // Default level
          })) || [],
        skillsWanted:
          user.skillsToLearn?.map((skill) => ({
            name: skill,
            level: "Beginner",
          })) || [],
        experience: user.experience || "Not specified",
        experienceType: user.experienceType || "",
        matchScore: Math.floor(Math.random() * 21) + 80,
        _id: user._id,
      }));

      setMatches(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      setMatches([]); // Ensure matches is cleared on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchMatches(newFilters.skillCategory);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 flex-shrink-0 md:mr-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Find Matches
            </h1>
            <MatchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1 mt-8 md:mt-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Potential Skill Matches
              </h2>
              <p className="text-sm text-gray-600">
                {matches.length} matches found
              </p>
            </div>
            {loading ? (
              <div className="text-center text-gray-500">
                Loading matches...
              </div>
            ) : (
              <MatchesList matches={matches} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
