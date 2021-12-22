const fetch = require("node-fetch");

const RATE = 500;
const GOAL = 100000;

exports.handler = async () => {
  const query = `query FetchCount {
        airtable(table: "Submissions") {
          records
        }
      }
      `;

  let count;

  try {
    const req = await fetch("https://dusty-domains.hasura.app/v1/graphql", {
      method: "POST",
      body: JSON.stringify({
        query,
      }),
    });
    const { data } = await req.json();

    if (data?.airtable?.records) {
      count = data?.airtable?.records.length;
    } else {
      count = 0;
    }
  } catch (e) {
    console.log(e.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ message: "Error" }),
    };
  }

  const ratio = (count * RATE) / GOAL;
  const prcntify = (ratio) => `${ratio * 100}%`;
  const percent = prcntify(ratio);

  return {
    statusCode: 200,
    body: JSON.stringify({ percent, ratio, count }),
  };
};
