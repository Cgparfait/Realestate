const express = require('express')
const router = express.Router()
const adminControllers = require("../controllers/adminControllers")
const adminMiddlewares = require("../middlewares/adminMiddlewares")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/auth")
const Service = require('../models/services')
const Contact = require('../models/contacts')
const User = require('../models/user')



// dashboard
router.get("/", authMiddleware, async (req, res) => {
    try {
        const search_metrics = await adminControllers.getOrganicSearchMetrics()
        res.render("./admin/pages/dashboard", { search_metrics, activeNav: "dashboard" })
    }
    catch (err) {
        console.error("Failed to fetch search metrics or services data" + err)
        res.send("failed to load requirements for the page, please contact the developer to fix issue")
    }
})



// logout 
router.get('/logout', (req, res) => {
    res.clearCookie("token")
    res.redirect("/admin/login")
})

// login
router.get('/login', (req, res) => { res.render("./admin/pages/login", { error: false }) })
router.post('/login', async (req, res) => {
    let { username, password } = req.body
    username = username.toLowerCase().trim()

    err = {}
    if (!username) err.username = "Username is required"
    if (!password) err.password = "Password is required"
    if (err.username || err.password) return res.render("./admin/pages/login", { error: "Username or password can not be empty" })

    try {
        const user = await User.findOne({ username, password: password })
        if (!user) return res.render("./admin/pages/login", { error: "Invalid credentials" })

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        // req.session.token = token
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: "strict",
            maxAge: 3600000  // 1 hour
        })
        res.redirect("/admin/")
    }
    catch (error) {
        console.log(error)
        res.send("failed to login, please contact the developer to fix issue")
    }
})

// Secure routes
router.use(authMiddleware)

router.get("/service/edit", async (req, res) => {
    const services = await Service.find()
    if (!services) return res.status(404).json({ error: "services not found" });

    res.render("./admin/pages/edit-service", { services: services, activeNav: "edit-service" })
})

router.get("/service/create", async (req, res) => {
    res.render("./admin/pages/create-service", { activeNav: "create-service" })
})

// Json API
router.get("/all-services/", async (req, res) => {
    try {
        const services = await Service.find()
        if (!services) return res.status(404).json({ error: "services not found" });

        // console.log(services)
        res.json({ services })
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/service/delete", async (req, res) => {
    const services = await Service.find()
    if (!services) return res.status(404).json({ error: "services not found" });
    res.render("./admin/pages/delete-service", { services: services, activeNav: "delete-service" })
})

router.post("/service/delete", async (req, res) => {
    const id = req.body.id
    if (!id) return res.status(404).json("Service id not provided");

    try {
        const deletedService = await Service.deleteOne({ _id: id })
        if (!deletedService) return res.status(404).json({ error: "service not deleted" });

        return res.json(deletedService)
    }
    catch (error) {
        console.error(error)
        return res.status(404).json({ error: "failed to delete service" })

    }
})




router.post("/service/create", async (req, res) => {
    const { title, description } = req.body
    console.log(title, description)

    const err = {}
    if (!title) err.title = "Title field is required"
    if (!description) err.description = "Description field is required"

    if (err.title || err.description) return res.status(404).json({ err })

    try {
        const service = new Service({ title, description })
        const savedService = await service.save()

        if (!savedService) return res.status(404).json({ error: "failed to create service" })
        return res.json(savedService)
    }
    catch (error) {
        console.error(error)
        return res.status(404).json({ error: "failed to create service" })

    }
})


router.post("/service/edit/", async (req, res) => {
    const id = req.body.id
    if (!id) return res.status(404).json("Service id not provided");

    const { title, description } = req.body

    if (!title && !description) return res.status(404).json({ error: "Please provide title or description" })

    const newData = {}
    if (title) newData.title = title
    if (description) newData.description = description

    try {
        const serviceUpdated = await Service.updateOne({ _id: id }, { $set: newData })
        if (!serviceUpdated) return res.status(404).json({ error: "Failed to update service" })

        res.json(serviceUpdated)
    }
    catch (error) {
        console.error(error)
        return res.status(404).json({ error: "Failed to update service" })
    }


})


router.get("/contact/edit/", async (req, res) => {
    const contacts = await Contact.find()
    if (!contacts) return res.status(404).json({ error: "contacts not found" });

    const { email, phone, address, _id } = contacts[0]
    res.render("./admin/pages/edit-contact", { email: email, phone: phone, address: address, id: _id, activeNav: "edit-contact" })
})

router.post("/contact/edit", async (req, res) => {
    console.log("id")
    const id = req.body.id
    if (!id) return res.status(404).json("Service id not provided");

    console.log("past id check")
    const { email, phone, address } = req.body

    if (!email && !phone && !address) return res.status(404).json({ error: "Please provide phone, email, physical address" })

    const newData = {}
    if (email) newData.email = email
    if (phone) newData.phone = phone
    if (address) newData.address = address

    try {
        const contactUpdated = await Contact.updateOne({ _id: id }, { $set: newData })
        if (!contactUpdated.modifiedCount) return res.status(404).json({ error: "Failed to update service" })

        res.json(contactUpdated)
    }
    catch (error) {
        console.error(error)
        return res.status(404).json({ error: "Failed to update service" })
    }
})


module.exports = router