const express = require("express")
const router = express.Router()
const landingControllers = require("../controllers/landingControllers")


router.get('/', landingControllers.renderHomePage)
router.get('/services', landingControllers.renderServicesPage)
router.post('/send-email', landingControllers.sendMail)


module.exports = router