import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      teaches: {
        type: String,
      },
      learns: {
        type: String,
      },
    },
  ],
  status: {
    type: String,
    default: "active",
  },
  nextSession: {
    type: String,
    default: null,
  },
});

export const Exchange = mongoose.model("Exchange", exchangeSchema);
