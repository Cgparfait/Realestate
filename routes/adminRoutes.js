const express = require('express')
const router = express.Router()
const adminControllers = require("../controllers/adminControllers")
const adminMiddlewares = require("../middlewares/adminMiddlewares")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

router.get('/', adminControllers.getDashboard)
// router.get('/login', adminMiddlewares.checkLoginCredentials, adminControllers.login)

// login
router.post('/login', async (req, res) => {
    console.log("login route triggered")
    const { username, password } = req.body

    err = {}
    if (!username) err.username = "Username is required"
    if (!password) err.password = "Password is required"
    if (err.username || err.password) return res.status(404).json({ error: err })

    try {
        const user = await User.findOne({ username: username, password: password })
        if (!user) return res.status(404).json({ error: "User does not exit" })

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        res.json({ token })
    }
    catch (error) {
        console.log(error)
    }
})


router.delete("/service/delete/:id", adminMiddlewares.validateDeleteAction, adminControllers.deleteOneService)
router.patch("/service/update/:id", adminMiddlewares.validateServiceUpdateAction, adminControllers.updateService)


module.exports = router