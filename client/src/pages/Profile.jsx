import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import GitHubRepoAnalyzer from "./GithubRepoAnalyzer";
import { axiosInstance } from "../lib/axiosInstance";
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
  const { clerkId } = useParams();
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);
  const [updateData, setUpdateData] = useState({
    skills: "",
    projects: "",
    location: "",
    role: "",
    availability: "",
    skillsToLearn: "",
    experience: "",
    experienceType: "",
  });

  const isCurrentUser = !clerkId || clerkId === user?.id;

  const fetchProfile = async () => {
    const token = await getToken();
    const endpoint = clerkId ? `/user/profile/${clerkId}` : "/user/profile";
    const res = await axiosInstance.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data.user);
    setLoading(false);

    if (res.data.user?.certificates?.length && isCurrentUser) {
      const results = await Promise.all(
        res.data.user.certificates.map(async (url) => {
          try {
            const verifyRes = await axiosInstance.post("/verify", {
              certificateUrl: url,
              userId: res.data.user._id,
            });
            return verifyRes.data;
          } catch {
            return { isVerified: false };
          }
        })
      );
      setVerificationResults(results);
    }

    setUpdateData({
      skills: res.data.user.skills?.join(", ") || "",
      skillsToLearn: res.data.user.skillsToLearn?.join(", ") || "",
      projects:
        res.data.user.projects
          ?.map((p) => (typeof p === "string" ? p : p.url))
          .join(", ") || "",
      location: res.data.user.location || "",
      role: res.data.user.role || "",
      availability: res.data.user.availability?.join(", ") || "",
      experience: res.data.user.experience || "",
      experienceType: res.data.user.experienceType || "",
    });
  };

  useEffect(() => {
    if (isSignedIn) fetchProfile();
  }, [clerkId, isSignedIn]);

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
      alert("Profile update failed.");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading profile...</p>;
  if (!profile)
    return <p className="text-center mt-8 text-red-500">Profile not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-teal-600 shadow-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.firstName}
            </h1>
            <p className="text-md text-teal-600 mt-1">{profile.role}</p>
          </div>
        </div>
        {isCurrentUser && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 sm:mt-0 flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            <Pencil size={16} className="mr-2" />
            Update Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ProfileInfo
          icon={<MapPin />}
          title="Location"
          value={profile.location}
        />
        <ProfileInfo
          icon={<BadgeCheck />}
          title="Skills"
          value={profile.skills?.join(", ")}
        />
        <ProfileInfo
          icon={<Users />}
          title="Skills to Learn"
          value={profile.skillsToLearn?.join(", ")}
        />
        <ProfileInfo
          icon={<Briefcase />}
          title="Experience"
          value={profile.experience}
        />
        <ProfileInfo
          icon={<LayoutDashboard />}
          title="Experience Type"
          value={profile.experienceType}
        />
        <ProfileInfo
          icon={<Calendar />}
          title="Availability"
          value={profile.availability?.join(", ")}
        />
        <ProfileInfo
          icon={<Folder />}
          title="Projects"
          value={
            profile.projects?.length ? (
              <ul className="space-y-1">
                {profile.projects.map((p, idx) => {
                  const name =
                    typeof p === "string" ? `Project ${idx + 1}` : p.name;
                  const url = typeof p === "string" ? p : p.gitHubUrl;

                  return (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-gray-800">{name}</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-800"
                        title="View GitHub Repository"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 3h7m0 0v7m0-7L10 14"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 10v11h11"
                          />
                        </svg>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              "No projects listed"
            )
          }
        />
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Analyze GitHub Repositories
        </h2>
        <GithubRepoAnalyzer defaultRepos={profile.projects || []} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Upload size={18} /> Certificates
        </h2>
        {profile.certificates?.length ? (
          <div className="flex flex-wrap gap-4">
            {profile.certificates.map((url, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={url}
                  alt={`certificate-${idx}`}
                  className="w-40 h-40 object-cover rounded-xl border"
                />
                {verificationResults[idx] && (
                  <p
                    className={`mt-1 text-sm font-medium ${
                      verificationResults[idx].isVerified
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {verificationResults[idx].isVerified
                      ? "Verified ✅"
                      : "Not Verified ❌"}
                  </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Update Profile
            </h2>
            <div className="space-y-3">
              {Object.keys(updateData).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={updateData[key]}
                  onChange={handleUpdateChange}
                  placeholder={`Enter ${key}`}
                  className="w-full border p-2 rounded-md"
                />
              ))}
              <button
                onClick={handleProfileUpdate}
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
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
    <h2 className="flex items-center gap-2 text-md font-semibold text-gray-700 mb-1">
      {icon} {title}
    </h2>
    <div className="text-gray-600">{value || "Not specified"}</div>
  </div>
);

export default ProfilePage;
