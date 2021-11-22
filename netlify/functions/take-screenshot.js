const fetch = require("node-fetch");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const takeScreenshot = async (url) => {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    args: chromium.args,
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url);

  let screenshotBase64 = await page
    .screenshot({ encoding: "base64" })
    .then(function (data) {
      let base64Encode = `data:image/png;base64,${data}`;
      return base64Encode;
    });

  await browser.close();

  return screenshotBase64;
};

exports.handler = async (event) => {
  const submissionURL = JSON.parse(event.body);
  const submissionHeaders = await fetch(submissionURL);
  const isNetlifySite =
    new Map(submissionHeaders.headers).get("server") === "Netlify"
      ? true
      : false;

  if (isNetlifySite) {
    const screenshot = await takeScreenshot(submissionURL);

    return {
      statusCode: 200,
      body: JSON.stringify(screenshot),
    };
  } else {
    return {
      statusCode: 418,
      body: "It looks like the site you submitted is not a Netlify site, how dare you. 🙄", //To do: Probably change this to a not-so-aggressive error message 😂
    };
  }
};