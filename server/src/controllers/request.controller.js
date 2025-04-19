import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js";

export const sendRequest = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { toUserId, skillToLearn, skillToTeach } = req.body;

    if (!skillToLearn || !skillToTeach) {
      return res.status(401).json({ message: "Skill fields are mandatory" });
    }

    const senderUser = await User.findOne({ clerkId: userId });
    const receiverUser = await User.findById(toUserId);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const existingRequest = await Request.findOne({
      $and: [
        { fromUser: senderUser._id },
        { toUser: receiverUser._id },
        { skillToLearn },
      ],
    });

    if (existingRequest) {
      return res.status(402).json({ message: "Request already sent" });
    }

    const newRequest = await Request.create({
      fromUser: senderUser._id,
      toUser: receiverUser._id,
      skillToLearn,
      skillToTeach,
    });

    await newRequest.save();

    return res.status(200).json({ message: "Request send successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const respondRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res
      .status(200)
      .json({ message: `Request ${status}`, updatedRequest });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const requests = await Request.find({
      toUser: currentUser._id,
      status: "pending",
    })
      .populate("fromUser", "firstName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
