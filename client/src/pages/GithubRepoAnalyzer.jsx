import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const GitHubRepoAnalyzer = () => {
  const { isSignedIn } = useUser();
  const [repoUrl, setRepoUrl] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/repoVerify", {
        repoUrl,
        language,
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return <p>Please sign in to analyze a GitHub repo.</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">GitHub Repo Analyzer</h2>

      <input
        type="text"
        placeholder="GitHub Repo URL (e.g., https://github.com/user/repo)"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        placeholder="Programming Language (e.g., javascript)"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Submit"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p><strong>Total Files:</strong> {result.totalFiles}</p>
          <p><strong>Avg. Lines/File:</strong> {result.avgLinesPerFile}</p>
          <p><strong>Longest File:</strong> {result.longestFile}</p>
        </div>
      )}
    </div>
  );
};

export default GitHubRepoAnalyzer;
