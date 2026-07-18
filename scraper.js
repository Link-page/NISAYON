const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // הגדרה כדי שלא יחסמו אותנו
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

  // שאיבת ה-Kicks
  await page.goto('https://kick.com/api/v1/kicks/4865495/leaderboard');
  const kicksData = await page.evaluate(() => document.querySelector('body').innerText);
  fs.writeFileSync('leaderboard.json', kicksData);

  // שאיבת ה-Subs
  await page.goto('https://kick.com/api/v2/channels/ronengg/leaderboards');
  const subsData = await page.evaluate(() => document.querySelector('body').innerText);
  fs.writeFileSync('subs.json', subsData);

  await browser.close();
})();
