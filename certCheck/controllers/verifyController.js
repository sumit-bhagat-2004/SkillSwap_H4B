const extractCertificateData = require('../utils/extractCertificateData');

module.exports = async function verifyCertificate(req, res){
  const { certificateUrl } = req.body;

  try {
    // Extract details from certificate (image or page)
    const extracted = await extractCertificateData(certificateUrl);

    // Get logged-in user from Clerk middleware
    const clerkUser = req.auth.user;

    if (!clerkUser) {
      return res.status(401).json({ verified: false, message: "Not authenticated" });
    }

    const userName = `John Doe`.trim();

    // Compare names (case insensitive)
    if (userName.toLowerCase() === extracted.name.toLowerCase()) {
      res.json({
        verified: true,
        matchedName: userName,
        certificateData: extracted,
      });
    } else {
      res.json({
        verified: false,
        reason: 'Name mismatch',
        expected: userName,
        found: extracted.name,
        certificateData: extracted,
      });
    }

  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ verified: false, error: error.message });
  }
};
