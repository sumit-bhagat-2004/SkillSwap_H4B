const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs');
const path = require('path');
const { analyzeCodeQuality } = require('./codeQuality');

async function analyzeRepo(repoUrl, language) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const cloneDir = path.join(__dirname, '..', 'repos', repoName);

  if (fs.existsSync(cloneDir)) {
    fs.rmdirSync(cloneDir, { recursive: true });
  }
  fs.mkdirSync(cloneDir, { recursive: true });

  // Clone the GitHub repository
  try {
    console.log(`Cloning repository ${repoUrl}...`);
    await git.clone(repoUrl, cloneDir);
  } catch (err) {
    throw new Error(`Error cloning repository: ${err.message}`);
  }

  // Analyze the files for the language
  const languageFiles = getFilesByLanguage(cloneDir, language);

  if (languageFiles.length === 0) {
    return { verified: false, message: `No ${language} files found` };
  }

  // Analyze the quality of the code in the given language
  const qualityResult = await analyzeCodeQuality(languageFiles);

  return {
    verified: true,
    language_files: languageFiles,
    quality: qualityResult,
  };
}

function getFilesByLanguage(cloneDir, language) {
  const extensions = getLanguageExtensions(language);
  let files = [];

  const walkDir = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        walkDir(itemPath); // Recursively walk through directories
      } else if (extensions.some((ext) => item.endsWith(ext))) {
        files.push(itemPath);
      }
    });
  };

  walkDir(cloneDir);
  return files;
}

function getLanguageExtensions(language) {
  const extensions = {
    python: ['.py'],
    javascript: ['.js'],
    java: ['.java'],
    ruby: ['.rb'],
    go: ['.go'],
  };
  return extensions[language.toLowerCase()] || [];
}

module.exports = { analyzeRepo };
