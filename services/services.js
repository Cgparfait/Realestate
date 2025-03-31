const db = require('../config/db');
const Service = require('../models/services');


const createService = (title, description) => {
    const newService = new Service({ title: title, description: description })
    newService.save()
        .then((service) => { console.log(service.title + " has been saved successfully") })
        .catch((err) => { console.error(err) })
}

const updateService = async (id, updatedData) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(id, { $set: updatedData })

        if (!updatedService) {
            console.log("failed to update service: " + id + " with: ", updatedData)
            return false
        }
        else { return true }
    }
    catch (err) {
        console.error({ message: "unexpected error ocured while updating service: " + id + " with: " + updatedData, error: err })
    }
}

const deleteService = async (id) => {
    try {
        const deletedService = await Service.findByIdAndDelete(id)
        if (!deletedService) return false
        console.log("service deleted successfully")
        return true
    }
    catch (err) {
        console.log("unable to delete service: " + err)
        return false
    }
}

const getAllServices = async () => {
    try {
        const services = await Service.find()
        return services
    }
    catch (err) {
        console.error({ message: "couldn't find the services", error: err })
    }
}

module.exports = { createService, updateService, deleteService, getAllServices }