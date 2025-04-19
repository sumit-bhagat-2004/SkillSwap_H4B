const axios = require("axios");
const cheerio = require("cheerio");
const Tesseract = require("tesseract.js");

async function extractTextFromUrl(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];

    // If it's an image, use OCR
    if (contentType.startsWith("image")) {
      const imageBuffer = Buffer.from(response.data);

      const {
        data: { text },
      } = await Tesseract.recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m),
      });

      return text;
    }

    // If it's HTML, scrape text using Cheerio
    if (contentType.includes("text/html")) {
      const $ = cheerio.load(response.data.toString());
      return $("body").text();
    }

    return null;
  } catch (err) {
    console.error("Extraction error:", err.message);
    return null;
  }
}

module.exports = extractTextFromUrl;
