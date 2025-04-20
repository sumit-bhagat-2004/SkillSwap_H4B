import { getRepoFiles, analyzeCodeFiles } from "../../utils/githubUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { repoUrl, language } = req.body;

  if (!repoUrl || !language) {
    return res.status(400).json({ message: "Missing repo URL or language." });
  }

  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)(\/|$)/);
    if (!match) throw new Error("Invalid GitHub URL");

    const owner = match[1];
    const repo = match[2];

    const files = await getRepoFiles(owner, repo, language);
    const analysis = analyzeCodeFiles(files);

    res.status(200).json(analysis);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ message: error.message });
  }
}
