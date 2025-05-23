import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import cloudinary from "../../lib/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

export const saveAuthenticatedUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const clerkUser = await clerkRes.json();

    const existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      clerkId: userId,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      avatar: clerkUser.image_url,
      skills: [],
      certificates: [],
      availability: [],
      projects: [],
      role: "",
      location: "",
      isOnBoarded: false,
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "User saved successfully and saved to db", newUser });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const onboardUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      skills,
      projects,
      location,
      role,
      availability,
      skillsToLearn,
      experience,
      experienceType,
    } = req.body;

    if (!skills || !projects || !location || !role || !availability) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedProjects = [];
    try {
      parsedProjects = JSON.parse(projects);
      if (
        !Array.isArray(parsedProjects) ||
        parsedProjects.some((p) => !p.name || !p.gitHubUrl)
      ) {
        return res
          .status(400)
          .json({ message: "Each project must have a name and a url" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid projects format. Must be a JSON array." });
    }

    let certificateUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64Image = `data:${
          file.mimetype
        };base64,${file.buffer.toString("base64")}`;

        const uploaded = await cloudinary.uploader.upload(base64Image, {
          folder: "certificates",
          resource_type: "image",
        });

        certificateUrls.push(uploaded.secure_url);
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          skills: skills?.split(",").map((s) => s.trim()) || [],
          skillsToLearn: skillsToLearn?.split(",").map((s) => s.trim()) || [],
          projects: parsedProjects,
          location,
          role,
          experience,
          experienceType,
          availability: availability?.split(",").map((d) => d.trim()) || [],
          isOnBoarded: true,
        },
        $push: {
          certificates: { $each: certificateUrls },
        },
      },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    res.status(200).json({
      message: "User onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId: authUserId } = getAuth(req);

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkId = req.params.clerkId || authUserId;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMatchingUsers = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { skill } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const filter = {
      clerkId: { $ne: userId },
    };

    if (skill) {
      filter.skills = { $regex: new RegExp(`^${skill}$`, "i") };
    }

    const users = await User.find(filter).select("-email");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const {
      skills,
      projects,
      location,
      role,
      availability,
      skillsToLearn,
      experience,
      experienceType,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let certificateUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64Image = `data:${
          file.mimetype
        };base64,${file.buffer.toString("base64")}`;
        const uploaded = await cloudinary.uploader.upload(base64Image, {
          folder: "certificates",
          resource_type: "image",
        });
        certificateUrls.push(uploaded.secure_url);
      }
    }

    const $set = {};
    const $addToSet = {};

    if (location) $set.location = location;
    if (role) $set.role = role;
    if (experience) $set.experience = experience;
    if (experienceType) $set.experienceType = experienceType;
    if (availability)
      $set.availability = availability.split(",").map((d) => d.trim());

    if (skills)
      $addToSet.skills = { $each: skills.split(",").map((s) => s.trim()) };

    if (projects)
      $addToSet.projects = {
        $each: projects.split(",").map((p) => p.trim()),
      };

    if (skillsToLearn)
      $addToSet.skillsToLearn = {
        $each: skillsToLearn.split(",").map((s) => s.trim()),
      };

    if (certificateUrls.length)
      $addToSet.certificates = { $each: certificateUrls };

    const update = {};
    if (Object.keys($set).length > 0) update.$set = $set;
    if (Object.keys($addToSet).length > 0) update.$addToSet = $addToSet;

    if (!Object.keys(update).length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      update,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
