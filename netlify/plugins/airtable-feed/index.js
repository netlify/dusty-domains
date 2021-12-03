const fs = require('fs');
const fetch = require("node-fetch");
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

var dataDir;

// Construct the data object for submissions
const fetchSubmissions = async() => {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Submissions?maxRecords=10000&view=Approved&api_key=${AIRTABLE_API_KEY}`);
    const data = await response.json();
    return data.records.map(record=>{
        record.fields.linktext=new URL(record.fields.URL).hostname;
        const age = 2021-record.fields['Years unused'];
        if (age < 1) {
            record.fields.age = 'fresh';
        }
        else if (age == 1) {
            record.fields.age = '1 year dusty';
        }
        else if (age > 1) {
            record.fields.age = `${age} years dusty`;
        }
        else {
            record.fields.age = '';
        }
        return record
    });
}


// save the data to the specified file
const saveData = async(data, file) => {
    const path = `${dataDir}/${file}`;
    await fs.writeFileSync(path, JSON.stringify(data));
    console.log(`Fetched and stashed: => ${path}`);
}


module.exports = {

    async onPreBuild({ inputs, utils }) {

        // ensure we have the specified directory for our data
        dataDir = inputs.dataDir;
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        try {
            const submissions = await fetchSubmissions();
            await saveData(submissions, 'submissions.json');
        } catch (err) {
            utils.build.failBuild(`Error fetching data: ${err}`);
        }
    }

};