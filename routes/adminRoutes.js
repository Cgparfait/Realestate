const express = require('express')
const router = express.Router()
const adminControllers = require("../controllers/adminControllers")
const adminMiddlewares = require("../middlewares/adminMiddlewares")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/auth")
const Service = require('../models/services')


// router.get('/login', adminMiddlewares.checkLoginCredentials, adminControllers.login)
router.get('/', authMiddleware, adminControllers.getDashboard)



// login
router.get('/login', (req, res) => { res.render("./pages/admin/login") })
router.post('/login', adminControllers.login)

// Secure routes



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

router.get("/service/:id", async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(404).json("Service id not provided");

    try {
        const service = await Service.findOne({ _id: id })
        if (!service) return res.status(404).json({ error: "service does not exist" });

        res.json({ service })
    }
    catch (err) {
        console.log(err)
        return res.status(404).json({ error: "service does not exist" });
    }
})

router.delete("/service/delete/:id", async (req, res) => {
    const id = req.params.id
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


router.put("/service/create", async (req, res) => {
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


router.patch("/service/edit/:id", async (req, res) => {
    const id = req.params.id
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
// router.patch("/service/update/:id", adminMiddlewares.validateServiceUpdateAction, adminControllers.updateService)

module.exports = router