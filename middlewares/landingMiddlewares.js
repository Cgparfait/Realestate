


const verifyContactForm = (req, res, next) => {
    const fields = [req.body.address, req.body.name, req.body.phone, req.body.email, req.body.message]

    if (hasEmptyField(fields))
        return res.status(400).json({ message: 'Missing required fields: address, name, phone, email, message' });
    else next()
}

function hasEmptyField(fields) {
    for (i = 0; i < fields.length; i++) {
        if (isEmptyField(fields[0])) return true
        else return false
    }
}

function isEmptyField(field) {
    if (field == ' ' || field == null || field === undefined || !field) return True
    else return false
}


module.exports = { verifyContactForm }


