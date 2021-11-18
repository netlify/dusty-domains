const fetch = require("node-fetch");
const Airtable = require("airtable");

exports.handler = async () => {
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

  const submission = {
    Name: "Beep",
    Email: "beep@boop.com",
    URL: "http://google.com",
    "Years unused": 20,
  };

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
        console.log(record);
      });
    }
  );

  return {
    statusCode: 200,
    body: "Hello world",
  };
};
