const fetch = require("node-fetch");
const Airtable = require("airtable");

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
    var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
      AIRTABLE_BASE_ID
    );
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
      body: "Your site has been successfully submitted! Woop, Woop! 🥳",
    };
  } else {
    return {
      statusCode: 418,
      body: "It looks like the site you submitted is not a Netlify site, how dare you. 🙄", //To do: Probably change this to a not-so-aggressive error message 😂
    };
  }
};
