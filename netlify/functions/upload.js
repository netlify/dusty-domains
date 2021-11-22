const cloudinary = require("cloudinary").v2;
const fetch = require("node-fetch");
const Airtable = require("airtable");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

  // Step 1: upload to Cloudinary

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudinaryResp = await cloudinary.uploader.upload(
    data.screenshotBase64,
    {
      folder: "dusty-domains",
    },
    function (error, result) {
      console.log(error);
    }
  );

  const screenshotURL = cloudinaryResp.secure_url;

  const submission = { ...data.submissionDetails, screenshot: screenshotURL };

  // Step 2: upload to Airtable

  var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
  base("Submissions").create(
    [
      {
        fields: submission,
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
    body: "Successfully submitted",
  };
};
