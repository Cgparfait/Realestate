const express = require('express')
const router = express.Router()
const adminControllers = require("../controllers/adminControllers")
const adminMiddlewares = require("../middlewares/adminMiddlewares")

router.get('/', adminControllers.getDashboard)
router.get('/login', adminMiddlewares.checkLoginCredentials, adminControllers.login)


module.exports = router