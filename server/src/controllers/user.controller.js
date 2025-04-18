import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import cloudinary from "../../lib/cloudinary.js";

export const saveAuthenticatedUser = async (req, res) => {
  try {
    const { userId, emailAddresses, firstName, lastName, profileImageUrl } =
      getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await User.findOne({ clerkId: userId });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      clerkId: userId,
      email: emailAddresses[0]?.emailAddress,
      firstName,
      lastName,
      skills: [],
      certificates: [],
      projects: [],
      avatar: profileImageUrl,
      location: "",
      role: "",
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "User saved successfully and saved to db", newUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const onboardUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { skills, projects, location, role } = req.body;

    if (!skills || !projects || !location || !role) {
      return res.status(401).json({ message: "Nothing to update" });
    }

    let certificateUrls = [];

    for (const file of req.files) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      const uploaded = await cloudinary.uploader.upload(base64Image, {
        folder: "certificates",
        resource_type: "image",
      });

      certificateUrls.push(uploaded.secure_url);
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          skills: skills?.split(",").map((s) => s.trim()) || [],
          projects: projects?.split(",").map((p) => p.trim()) || [],
          location,
          role,
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
