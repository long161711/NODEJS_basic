const jwt = require("jsonwebtoken");
const services = require("../services/userServices");
const dotenv = require("dotenv");
const { use } = require("bcrypt/promises");
dotenv.config()
let authLogin = {


    // verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).send({ message: err.message })
                }
                req.user = user
                next()
            })
        }
        else {
            return res.status(401).json("you not login")
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).send({ message: err.message })
                }
                if (user.role == "Admin" || user.id == req.params.id) {
                    req.user
                    next()
                }
                else {
                    return res.status(403).json({ message: "you not have role" })
                }

            })
        }
    },
    refreshToken: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json("pleess login")
        }
        else {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
                if (err) {
                    return res.status(403).send({ message: err.message })
                }
                else {
                    let accessNewToken = services.createAccessToken({ id: user.id, role: user.role })
                    next()
                    return res.status(200).json({ token: accessNewToken })
                }
            })
        }
    }
}

module.exports = authLogin;