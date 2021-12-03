const cloudinary = require('cloudinary').v2;
const Airtable = require('airtable');

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

  let screenshotURL;

  try {
    // Step 1: upload to Cloudinary

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const url = new URL(data.URL);

    const screenshotResp = await cloudinary.uploader.explicit(
      `https://${url.hostname}`,
      {
        transformation: [
          {
            gravity: 'north',
            width: 1600,
            height: 900,
            crop: 'fill',
          },
        ],
        sign_url: true,
        type: 'url2png',
        async: true,
        folder: 'dusty-domains',
      },
    );

    const screenshotUrl = `https://res.cloudinary.com/netlify/image/url2png/q_auto,f_auto,w_1600,h_900,c_fill,g_north/${screenshotResp.public_id}`;

    // Step 2: upload to Airtable

    var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
      AIRTABLE_BASE_ID,
    );

    const airtableResponse = await base('Submissions').create([
      {
        fields: {
          Name: data['Name'],
          Email: data['Email'],
          URL: data['URL'],
          'Years unused': data['Years unused'],
          screenshot: screenshotUrl,
        },
      },
    ]);

    if (!airtableResponse || !airtableResponse[0] || !airtableResponse[0].id) {
      throw new Error('failed to create Airtable entry');
    }

    const name = new URL(data.URL).host;
    let redirect = `/thanks/${name}`;

    if (data['Years unused'] && data['Years unused'] > 1990) {
      redirect += `/${2021 - data['Years unused']}`;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ redirect }),
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: 'Something went wrong while uploading your submission',
    };
  }
};
