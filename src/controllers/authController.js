const services = require("../services/userServices");
let registerUser = async (req, res) => {
    try {
        const user = await services.createNewUser(req.body)
        console.log(user)
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json("ngu");
    }

}

let login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(401).json({
            err: 1,
            message: "email || password undefined"
        })
    }
    try {
        let message = await services.checkLogin(req.body)
        if (message.err == 0) {
            res.cookie("refreshToken", message.refreshToken, {
                httpOnly: true,
                path: '/',
                sameSite: "strict"
            })
            const message1 = {
                user: message.user,
                err: message.err,
                message: message.message,
                token: message.token,
            }
            return res.status(200).json(message1)
        }

        return res.status(200).json(message)
    } catch (e) {
        return res.status(500).json(e);
    }
}

let allUser = async (req, res) => {
    let users = await services.allUser()
    return res.status(200).json(users)
}
let deleteUser = async (req, res) => {
    // return res.status(200).json(req.params.id)
    try {
        let id = req.params.id;
        if (id) {
            let user = await services.findOneById(id)
            return res.status(200).json(user)
        }
    } catch (e) {
        return res.status(500).json(e)
    }
}
let logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { path: '/' })
        return res.status(200).json({ message: "Logged out" })
    } catch (err) {
        return res.status(500).send({ message: err.message })

    }
}
module.exports = {
    registerUser: registerUser,
    login: login,
    allUser: allUser,
    deleteUser: deleteUser,
    logout: logout
}