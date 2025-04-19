import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import axios from "axios";

const ProfilePage = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { clerkId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationResults, setVerificationResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isSignedIn) return;

      const token = await getToken();
      try {
        const endpoint = clerkId ? `/user/profile/${clerkId}` : "/user/profile";
        const res = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data.user);

        if (!clerkId && res.data.user?.certificates?.length) {
          const results = await Promise.all(
            res.data.user.certificates.map(async (url) => {
              try {
                const verifyRes = await axios.post(
                  "http://localhost:5000/api/verify",
                  {
                    certificateUrl: url,
                    userId: res.data.user._id,
                  }
                );
                return verifyRes.data;
              } catch (err) {
                console.error("Verification error:", err);
                return { isVerified: false, extractedDetails: null };
              }
            })
          );
          setVerificationResults(results);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [clerkId, isSignedIn]);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg text-gray-600 animate-pulse">
        Loading profile...
      </div>
    );
  if (!profile)
    return (
      <div className="text-center mt-10 text-lg text-red-500">
        Profile not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={profile.avatar || "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {profile.firstName || "User"}
          </h1>
          <p className="text-md text-teal-600 mt-1">
            {profile.role || "No role specified"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-gray-700 mb-1">
            📍 Location
          </h2>
          <p className="text-gray-600">{profile.location || "Not provided"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-gray-700 mb-1">🛠 Skills</h2>
          <p className="text-gray-600">
            {profile.skills?.join(", ") || "None"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-gray-700 mb-1">
            📂 Projects
          </h2>
          <p className="text-gray-600">
            {profile.projects?.join(", ") || "None"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold text-gray-700 mb-1">
            📅 Availability
          </h2>
          <p className="text-gray-600">
            {(profile.availability || profile.availabitity)?.join(", ") ||
              "Not specified"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          📜 Certificates
        </h2>
        {profile.certificates?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {profile.certificates.map((url, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={url}
                  alt={`certificate-${idx}`}
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                {verificationResults[idx] && (
                  <div
                    className={`mt-2 text-sm font-medium ${
                      verificationResults[idx].isVerified
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {verificationResults[idx].isVerified
                      ? "Verified ✅"
                      : "Not Verified ❌"}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No certificates uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
