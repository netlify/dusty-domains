const cloudinary = require("cloudinary").v2;
const Airtable = require("airtable");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

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
    console.log("Before Airtable initialization");
    var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
      AIRTABLE_BASE_ID
    );
    console.log("After Airtable initialization");

    base("Submissions").create(submissionData,
      function (err, records) {
        console.log("Entering the callback for airtable");
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

    console.log("After Airtable execution");

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
