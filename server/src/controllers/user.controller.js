import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";

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
    res.status(500).json({ message: "Internal server error" });
  }
};
