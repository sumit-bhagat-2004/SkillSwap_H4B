import { getAuth } from "@clerk/express";
import { Exchange } from "../models/exchange.model.js";
import { User } from "../models/user.model.js";

export const getMyExchanges = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exchanges = await Exchange.find({
      "participants.userId": user._id,
    }).populate("participants.userId", "firstName avatar");

    return res.status(200).json({ exchanges });
  } catch (error) {
    console.error("GetMyExchanges error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
