const jwt = require("jsonwebtoken")
require("dotenv").config()

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        console.log({ error: "Unauthorized, token not working" })
        return res.redirect("/admin/login")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decoded
        console.log("pass authentication")
        next()
    }
    catch (err) {
        res.status(404).json({ error: "invalid token" })
        res.redirect("/admin/login")
    }
}

module.exports = authMiddleware