// const express = require("express");
// const authController = require("../controllers/authController");
// let router = express.Router()


// router.post('/rigister', authController.registerUser);

const express = require("express");
const authController = require("../controllers/authController");
// import authController from "../controllers/authController";
// import useController from "../controllers/userController";
const authLogin = require("../middleware/authLogin");
let router = express.Router();

let initWebRoutes = (app) => {
    router.post('/rigister', authController.registerUser);
    router.post('/login', authController.login);
    router.get("/allUser", authLogin.verifyToken, authController.allUser);
    router.post('/delete/:id', authLogin.verifyTokenAdmin, authController.deleteUser);
    router.get('/refreshToken', authLogin.refreshToken);
    router.get('/logout', authController.logout);
    return app.use("/", router);
}


module.exports = initWebRoutes;