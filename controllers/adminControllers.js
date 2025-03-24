const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const analyticsData = google.analyticsdata('v1beta');
const path = require("path")
const fs = require("fs")


const getDashboard = (req, res) => {
    getOrganicSearchMetrics().then((metrics) => {
        res.render("./pages/admin/dashboard", { metrics })
    }).catch(err => {
        console.error("Couldn't fetch search metrics" + err)
        res.render("./pages/admin/dashboard", { metrics: false })
    })
}


const login = (req, res) => {

}


async function getOrganicSearchMetrics() {
    // Replace with your service account key file path
    const KEY_FILE_PATH = path.join(process.env.SECRET_FOLDER_NAME + "/" + process.env.ANALYTICS_API_KEY_FILE_NAME)

    // Replace with your GA4 property ID
    const PROPERTY_ID = process.env.ANALYTICS_PROPERTY_ID;

    generate_analytics_api_key_file()
    const authClient = new JWT({
        keyFile: KEY_FILE_PATH,
        scopes: 'https://www.googleapis.com/auth/analytics.readonly'
    });

    await authClient.authorize();

    const response = await analyticsData.properties.runReport({
        auth: authClient,
        property: `properties/${PROPERTY_ID}`,
        requestBody: {
            dateRanges: [
                {
                    startDate: '31daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'landingPagePlusQueryString',
                },
            ],
            metrics: [
                {
                    name: 'organicGoogleSearchClicks',
                },
                {
                    name: 'organicGoogleSearchImpressions',
                },
                {
                    name: 'organicGoogleSearchClickThroughRate',
                },
            ],
        },
    });

    const metrics = response.data.rows[0].metricValues
    const organic_google_search_clicks = metrics[0].value
    const organic_google_search_impressions = metrics[1].value
    const organic_google_search_click_through_rate = parseFloat(metrics[2].value * 100);
    console.log(organic_google_search_click_through_rate)

    return { organic_google_search_clicks, organic_google_search_impressions, organic_google_search_click_through_rate }
}

function generate_analytics_api_key_file() {
    const analytics_key_file_name = process.env.ANALYTICS_API_KEY_FILE_NAME
    const analytics_key_file_data = process.env.ANALYTICS_API_KEY_FILE

    secret_folder_name = process.env.SECRET_FOLDER_NAME
    filePath = path.join(secret_folder_name + "/" + analytics_key_file_name)

    // delete and re-create directory
    resetDir(secret_folder_name)
    fs.writeFile(filePath, analytics_key_file_data, (err) => {
        if (err) console.error({ message: "could not create analytics key file", error: err })
        else console.log("analytics key file created successfuly!")
    })
}

function resetDir(dirName) {
    removeDir(dirName)
    createDir(dirName)
}
function removeDir(dirName) {
    fs.rmSync(dirName, { recursive: true, force: true })
}
function createDir(dirName) {
    fs.mkdirSync(dirName, { recursive: true });
    console.log(`Folder created: ${dirName}`);
}


module.exports = { getDashboard, login }