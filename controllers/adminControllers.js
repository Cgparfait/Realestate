const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const analyticsData = google.analyticsdata('v1beta');
const path = require("path")
const fs = require("fs")
const { encode, decode } = require("hi-base32");
const servicesQueries = require("../services/services");
const { error } = require('console');


const getDashboard = async (req, res) => {
    try {
        const services = await servicesQueries.getAllServices()
        const search_metrics = await getOrganicSearchMetrics()
        res.render("./pages/admin/dashboard", { search_metrics, services })
    }
    catch (err) {
        console.error("Failed to fetch search metrics or services data" + err)
        res.send("failed to load requirements for the page, please contact the developer to fix issue")
    }
}

const deleteOneService = async (req, res) => {
    const serviceId = req.params.id
    try {
        const deletedService = await servicesQueries.deleteService(serviceId)
        if (!deletedService) {
            console.error({ message: "failed to delete service with id: " + serviceId })
            return res.status(404).json({ actionCompleted: false })
        }
        return res.status(200).json({ actionCompleted: true })
    }
    catch (err) {
        console.error({ message: "failed to delete service with id: " + serviceId, error: error })
        return res.status(404).json({ actionCompleted: false })

    }
}

const updateService = async (req, res) => {
    try {
        const serviceUpdated = await servicesQueries.updateService(req.body.serviceData.id, req.body.serviceData)
        if (serviceUpdated) res.status(200).json({ actionCompleted: true, message: "service with id= " + req.body.serviceData.id + " has been updated" })
        else return res.status(200).json({ actionCompleted: true })
    }
    catch (err) {
        console.error("unable to update service " + req.body.serviceData.id, err)
        return res.status(404).json({ actionCompleted: false })
    }
}


const login = (req, res) => {

}


async function getOrganicSearchMetrics() {

    // Replace with your GA4 property ID
    const PROPERTY_ID = process.env.ANALYTICS_PROPERTY_ID;
    const client_email = process.env.ANALYTICS_CLIENT_EMAIL
    const private_key = decode(process.env.ANALYTICS_PRIVATE_KEY)

    const authClient = new JWT(
        client_email,
        null,
        private_key,
        ['https://www.googleapis.com/auth/analytics.readonly']
    );

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


module.exports = { getDashboard, login, deleteOneService, updateService }