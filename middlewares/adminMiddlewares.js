


const checkLoginCredentials = (req, res, next) => {

}

const validateDeleteAction = (req, res, next) => {
    validateIdParam(req, res, next)
}

const validateServiceUpdateAction = async (req, res, next) => {
    const { id } = req.params
    const { title, description } = req.body

    if (!id)
        return res.status(404).json({ actionCompleted: false, message: "Id field is missing" })
    else {
        const service = {}
        service.id = id
        if (!title && !description) {
            return res.status(404).json({ actionCompleted: false, message: "Please provide new title or description" })
        } else {
            console.log(title)
            if (title) service.title = title
            if (description) service.description = description
            req.body.serviceData = service
            next()
        }
    }

}

function validateIdParam(id) {
    if (!id) return false
    else return true
}


module.exports = { checkLoginCredentials, validateDeleteAction, validateServiceUpdateAction }