const { getRepoFiles, analyzeCodeFiles } = require("../utils/githubUtils");

exports.analyzeRepo = async (req, res) => {
  const { repoUrl, language } = req.body;

  if (!repoUrl || !language) {
    return res.status(400).json({ error: "repoUrl and language are required." });
  }

  try {
    const { owner, repo } = extractRepoInfo(repoUrl);
    const files = await getRepoFiles(owner, repo, language);
    const analysis = analyzeCodeFiles(files);

    // Determine the status based on the analysis
    let status;
    if (analysis.totalFiles === 0) {
      status = "declined"; // No files found for the specified language
    } else if (analysis.avgLinesPerFile > 100) {
      status = "error in verification"; // Example condition for error
    } else {
      status = "verified"; // Analysis passed successfully
    }

    return res.json({
      status,
      language,
      files: files.map(f => f.path),
      analysis
    });
  } catch (error) {
    return res.status(500).json({ status: "error in verification", error: error.message });
  }
};

function extractRepoInfo(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub repo URL");
  return { owner: match[1], repo: match[2] };
}
