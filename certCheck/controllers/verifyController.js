const extractTextFromUrl = require("../utils/extractText");
const User = require("../models/User");

function extractDetails(text) {
  const lower = text.toLowerCase();
  const course = text.match(/course[:\-]?\s*(.*)/i)?.[1] || "N/A";
  const name = text.match(/name[:\-]?\s*(.*)/i)?.[1] || "N/A";
  const status = lower.includes("completed") ? "Completed" : "Not Found";
  const dateMatch = text.match(/\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}/);
  const date = dateMatch ? dateMatch[0] : "N/A";

  return { course, name, status, date };
}

exports.verifyCertificate = async (req, res) => {
  const { certificateUrl, userId } = req.body;

  if (!certificateUrl || !userId) {
    return res.status(400).json({ error: "Missing certificate URL or user ID" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const rawText = await extractTextFromUrl(certificateUrl);
  if (!rawText) return res.status(500).json({ error: "Failed to extract certificate details" });

  const details = extractDetails(rawText);

  const isVerified = details.name.toLowerCase().includes(user.name.toLowerCase());

  res.json({
    extractedDetails: details,
    isVerified,
    matchedWith: user.name
  });
};
