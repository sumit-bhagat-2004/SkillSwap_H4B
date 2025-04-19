const axios = require('axios');
const Tesseract = require('tesseract.js');
const cheerio = require('cheerio');

module.exports = async function extractCertificateData(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const contentType = response.headers['content-type'];

  let result = {
    name: "Unknown",
    course: "Unknown",
    completed: false,
    date: "Unknown"
  };

  if (contentType.includes('image')) {
    const { data: { text } } = await Tesseract.recognize(response.data, 'eng');

    result.name = text.match(/Name[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.course = text.match(/Course[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.date = text.match(/Date[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.completed = /completed|successfully/i.test(text);
  } else if (contentType.includes('html')) {
    const $ = cheerio.load(response.data.toString());

    const bodyText = $('body').text();
    result.name = bodyText.match(/Name[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.course = bodyText.match(/Course[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.date = bodyText.match(/Date[:\-]?\s*(.*)/i)?.[1]?.trim() || "Unknown";
    result.completed = /completed|successfully/i.test(bodyText);
  }

  return result;
};
