import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axiosInstance";
import axios from "axios";
import {
  MapPin,
  BadgeCheck,
  Briefcase,
  LayoutDashboard,
  Users,
  Folder,
  Calendar,
  Upload,
  X,
  Pencil,
} from "lucide-react";

const ProfilePage = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { clerkId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);
  const isOwnProfile = !clerkId || clerkId === user?.id;

  const fetchProfile = async () => {
    if (!isSignedIn) return;
    const token = await getToken();
    try {
      const endpoint = clerkId ? `/user/profile/${clerkId}` : "/user/profile";
      const res = await axiosInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
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
              return { isVerified: false };
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

  useEffect(() => {
    fetchProfile();
  }, [clerkId, isSignedIn]);

  const [updateData, setUpdateData] = useState({
    skills: "",
    skillsToLearn: "",
    projects: "",
    location: "",
    role: "",
    availability: "",
    experience: "",
    experienceType: "",
  });

  useEffect(() => {
    if (profile) {
      setUpdateData({
        skills: profile.skills?.join(", ") || "",
        skillsToLearn: profile.skillsToLearn?.join(", ") || "",
        projects: profile.projects?.join(", ") || "",
        location: profile.location || "",
        role: profile.role || "",
        availability: profile.availability?.join(", ") || "",
        experience: profile.experience || "",
        experienceType: profile.experienceType || "",
      });
    }
  }, [profile]);

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    const token = await getToken();
    const formData = new FormData();
    for (const key in updateData) {
      formData.append(key, updateData[key]);
    }

    try {
      const res = await axiosInstance.put("/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(res.data.user);
      setShowModal(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Update failed.");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading profile...</p>
    );
  }

  if (!profile) {
    return <p className="text-center mt-10 text-red-500">Profile not found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-6 mb-4 sm:mb-0">
          <img
            src={profile.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-teal-500 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.firstName}
            </h1>
            <p className="text-teal-600 text-md">{profile.role || "No role"}</p>
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
          >
            <Pencil size={16} /> Update Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfo
          icon={<MapPin size={16} />}
          title="Location"
          value={profile.location}
        />
        <ProfileInfo
          icon={<BadgeCheck size={16} />}
          title="Skills"
          value={profile.skills?.join(", ")}
        />
        <ProfileInfo
          icon={<Folder size={16} />}
          title="Projects"
          value={profile.projects?.join(", ")}
        />
        <ProfileInfo
          icon={<Calendar size={16} />}
          title="Availability"
          value={profile.availability?.join(", ")}
        />
        <ProfileInfo
          icon={<Users size={16} />}
          title="Skills to Learn"
          value={profile.skillsToLearn?.join(", ")}
        />
        <ProfileInfo
          icon={<Briefcase size={16} />}
          title="Experience"
          value={profile.experience}
        />
        <ProfileInfo
          icon={<LayoutDashboard size={16} />}
          title="Experience Type"
          value={profile.experienceType}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4">
          <Upload size={18} /> Certificates
        </h2>
        {profile.certificates?.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {profile.certificates.map((url, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={url}
                  alt={`certificate-${idx}`}
                  className="w-40 h-40 object-cover rounded-xl border"
                />
                {verificationResults[idx] && (
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      verificationResults[idx].isVerified
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {verificationResults[idx].isVerified
                      ? "Verified ✅"
                      : "Not Verified ❌"}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No certificates uploaded.</p>
        )}
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Your Profile
            </h2>
            <div className="space-y-3">
              {Object.entries(updateData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleUpdateChange}
                  placeholder={`Enter ${key}`}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ))}
              <button
                onClick={handleProfileUpdate}
                className="w-full mt-4 bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileInfo = ({ icon, title, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
    <h2 className="text-sm font-semibold flex items-center gap-2 text-gray-700 mb-1">
      {icon} {title}
    </h2>
    <p className="text-gray-600">{value || "Not specified"}</p>
  </div>
);

export default ProfilePage;
