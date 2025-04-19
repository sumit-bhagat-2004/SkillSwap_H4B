const eslint = require('eslint');
const { ESLint } = eslint;

async function analyzeCodeQuality(files) {
  const eslintInstance = new ESLint();
  let results = [];

  for (const file of files) {
    const result = await eslintInstance.lintFiles(file);
    results.push({ file, result: result[0].messages });
  }

  return results;
}

module.exports = { analyzeCodeQuality };
