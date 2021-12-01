const cloudinary = require("cloudinary").v2;
const Airtable = require("airtable");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_API_URL = process.env.AIRTABLE_API_URL;

  try {
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
        if(error){
          console.error(error);
        } 
      }
    );

    const screenshotURL = cloudinaryResp.secure_url;

    const { ["screenshotBase64"]: remove, ...rest } = data;

    const submissionData = {
      ...rest,
      screenshot: screenshotURL,
    };

    // Step 2: upload to Airtable
    Airtable.configure({ 
      apiKey: AIRTABLE_API_KEY, 
      endpointUrl:  AIRTABLE_API_URL
    });

    var base = Airtable.base(
      AIRTABLE_BASE_ID
    );

    base("Submissions").create(
      [
        {
          fields: submissionData,
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          throw new Error("Failure in executing the Airbase submission.");
        }

        if(records) {
          console.log("Submission was successful")
          records.forEach(function (record) {
            console.log(record.getId());
          });
        }
      }
    );

    return {
      statusCode: 200,
      body: "Successfully submitted",
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Something went wrong while uploading your submission",
    };
  }
};
