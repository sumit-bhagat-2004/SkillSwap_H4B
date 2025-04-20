import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    location: {
      type: String,
    },
    role: {
      type: String,
    },
    isOnBoarded: {
      type: Boolean,
      default: false,
    },
    skills: [
      {
        type: String,
        default: [],
      },
    ],
    certificates: [
      {
        type: String,
        default: [],
      },
    ],
    projects: [
      {
        name: {
          type: String,
          required: true,
        },
        gitHubUrl: {
          type: String,
          required: true,
        },
      },
    ],
    availability: [
      {
        type: String,
        default: [],
      },
    ],
    skillsToLearn: [
      {
        type: String,
        default: [],
      },
    ],
    experience: {
      type: String,
    },
    experienceType: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
