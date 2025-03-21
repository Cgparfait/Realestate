const db = require('../config/db');
const Service = require('../models/services');


const createService = (title, description) => {
    const newService = new Service({title: title, description: description})
    newService.save()
    .then((service) => {console.log(service.title + " has been saved successfully")})
    .catch((err)=> {console.error(err)})
}

const updateService = (id, updatedData) => {
    Service.findByIdAndUpdate(id, {$set: updatedData})
    .then(()=>console.log("service updated successfully"))
    .catch((err)=>console.error("failed to update service: " + err))
}

const deleteService = (id) => {
    Service.findByIdAndDelete(id)
    .then(()=>{console.log("service deleted successfully")})
    .catch((err) => console.log("unable to delete service: " + err))
}

module.exports = {createService, updateService, deleteService}