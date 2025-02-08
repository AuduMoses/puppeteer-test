
const express = require("express");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteer = require("puppeteer-extra");
const userAgent = require("user-agents");
puppeteer.use(StealthPlugin());

const app = express();

app.use(express.json());



app.post("/quiz", async (req, res) => {
  try {
    await searchGoogle(req.body.question);
    res.status(200).json({ message: "Search completed" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error searching");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

async function searchGoogle(question) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      // "--proxy-server=your-proxy-server",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.setUserAgent(userAgent.random().toString());

  await page.goto("https://www.google.com/");

  const searchBox = await page.$("textarea[name='q']");
  await searchBox.type(question);
  await page.keyboard.press("Enter");

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.close();
}