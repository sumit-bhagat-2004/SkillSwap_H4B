import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axiosInstance";

const Onboarding = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skills: "",
    projects: "",
    location: "",
    role: "",
    availability: "",
    certificates: [],
    skillsToLearn: "",
    experience: "",
    experienceType: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificates") {
      setFormData({ ...formData, certificates: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const extractProjectObjects = (input) => {
    const urls = input
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
    return urls.map((url) => {
      const parts = url.split("/");
      const name = parts[parts.length - 1] || "Unnamed Project";
      return { name, gitHubUrl: url };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = await getToken();
    const data = new FormData();

    for (let key in formData) {
      if (key === "certificates") {
        for (let file of formData.certificates) {
          data.append("certificates", file);
        }
      } else if (key === "projects") {
        const projectObjects = extractProjectObjects(formData.projects);
        data.append("projects", JSON.stringify(projectObjects));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await axiosInstance.put("/user/onboard-user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/profile");
    } catch (err) {
      console.error("Onboarding failed", err);
      alert("Onboarding failed. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Complete Your Onboarding
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="location"
          placeholder="Your location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Your role (e.g. Frontend Developer)"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills you can teach (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="text"
          name="skillsToLearn"
          placeholder="Skills you want to learn (comma separated)"
          value={formData.skillsToLearn}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g., 2 years, Internship)"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="text"
          name="experienceType"
          placeholder="Experience Type (e.g., Professional, Academic)"
          value={formData.experienceType}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="text"
          name="projects"
          placeholder="GitHub Repositories (comma separated URLs)"
          value={formData.projects}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="text"
          name="availability"
          placeholder="Available days to teach (e.g. Monday, Wednesday)"
          value={formData.availability}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
        <input
          type="file"
          name="certificates"
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          multiple
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
