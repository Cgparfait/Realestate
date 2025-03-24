const express = require("express")
const router = express.Router()
const landingControllers = require("../controllers/landingControllers")
const landingMiddlewares = require("../middlewares/landingMiddlewares")


router.get('/', landingControllers.renderHomePage)
router.get('/services', landingControllers.renderServicesPage)
router.post('/send-email', landingMiddlewares.verifyContactForm, landingControllers.sendMail)


module.exports = router