require("dotenv").config(); 
const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json"
  }
});

async function getRepoFiles(owner, repo, language) {
    try {
        const response = await githubAPI.get(`/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
    
        const files = response.data.tree.filter(file =>
          file.type === "blob" && file.path.endsWith(getExtension(language))
        );
    
        const fileContents = await Promise.all(
          files.map(async (file) => {
            const raw = await githubAPI.get(`/repos/${owner}/${repo}/contents/${file.path}`);
            const content = Buffer.from(raw.data.content, "base64").toString("utf-8");
            return { path: file.path, content };
          })
        );
    
        return fileContents;
      } catch (error) {
        console.error("GitHub fetch error:", error.message);
        throw new Error("Failed to fetch repository data from GitHub.");
      }
}

function getExtension(language) {
  const map = {
    javascript: ".js",
    react: ".jsx",
    html: ".html",
    python: ".py",
    java: ".java",
    c: ".c",
    cpp: ".cpp",
    typescript: ".ts",
  };
  return map[language.toLowerCase()] || ".txt";
}

function analyzeCodeFiles(files) {
  return {
    totalFiles: files.length,
    avgLinesPerFile: (files.reduce((sum, file) => sum + file.content.split("\n").length, 0) / files.length).toFixed(2),
    longestFile: files.reduce((max, file) => file.content.length > max.content.length ? file : max, files[0])?.path,
  };
}

module.exports = { getRepoFiles, analyzeCodeFiles };
