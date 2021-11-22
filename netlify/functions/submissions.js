const fetch = require("node-fetch");
const Airtable = require("airtable");
const chromium = require("chrome-aws-lambda");
const cloudinary = require("cloudinary").v2;

const takeScreenshot = async (url) => {
  const browser = await chromium.puppeteer.launch();
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
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

  const submission = JSON.parse(event.body);
  const submissionHeaders = await fetch(submission.URL);
  const isNetlifySite =
    new Map(submissionHeaders.headers).get("server") === "Netlify"
      ? true
      : false;

  if (isNetlifySite) {
    const screenshot = await takeScreenshot(submission.URL);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const cloudinaryResp = await cloudinary.uploader.upload(
      screenshot,
      {
        folder: "dusty-domains",
      },
      function (error, result) {
        console.log(error);
      }
    );

    const screenshotCloudinaryUrl = cloudinaryResp.secure_url;

    var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
      AIRTABLE_BASE_ID
    );
    base("Submissions").create(
      [
        {
          fields: { ...submission, screenshot: screenshotCloudinaryUrl },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          // console.log(record);
        });
      }
    );

    return {
      statusCode: 200,
      body: "Your site has been successfully submitted! Woop, Woop! 🥳",
    };
  } else {
    return {
      statusCode: 418,
      body: "It looks like the site you submitted is not a Netlify site, how dare you. 🙄", //To do: Probably change this to a not-so-aggressive error message 😂
    };
  }
};
