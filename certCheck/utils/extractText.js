const axios = require("axios");
const cheerio = require("cheerio");
const Tesseract = require("tesseract.js");
const { createWorker } = Tesseract;

async function extractTextFromUrl(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    const contentType = response.headers['content-type'];

    // If it's an image, use OCR
    if (contentType.startsWith("image")) {
      const worker = await createWorker();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const { data: { text } } = await worker.recognize(Buffer.from(response.data));
      await worker.terminate();

      return text;
    }

    // If it's HTML, scrape using Cheerio
    if (contentType.includes("text/html")) {
      const $ = cheerio.load(response.data.toString());
      return $("body").text(); // Full body text
    }

    return null;
  } catch (err) {
    console.error("Extraction error:", err.message);
    return null;
  }
}

module.exports = extractTextFromUrl;
