const express = require('express')
const router = express.Router()
const adminControllers = require("../controllers/adminControllers")
const adminMiddlewares = require("../middlewares/adminMiddlewares")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/auth")

router.get('/', authMiddleware, adminControllers.getDashboard)
// router.get('/login', adminMiddlewares.checkLoginCredentials, adminControllers.login)

// login
router.get('/login', (req, res) => { res.render("./pages/admin/login") })
router.post('/login', adminControllers.login)

router.use(authMiddleware)
router.delete("/service/delete/:id", adminMiddlewares.validateDeleteAction, adminControllers.deleteOneService)
router.patch("/service/update/:id", adminMiddlewares.validateServiceUpdateAction, adminControllers.updateService)


module.exports = router