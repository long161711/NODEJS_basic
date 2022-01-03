const { reject } = require('bcrypt/promises');
const bcrypt = require('bcryptjs');
const db = require('../models/index');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const res = require('express/lib/response');
dotenv.config();
const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}
let createAccessToken = (data) => {
    let token = jwt.sign({
        data
    },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '10s' }
    )
    return token;
}
let createRefreshToken = (data) => {
    let token = jwt.sign({
        data
    },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '255d' }
    )
    return token;
}
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            console.log(hashPasswordFromBcrypt);
            //create new user
            let user = await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                fullName: data.fullName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                role: data.role,
            })
            resolve(user)
        } catch (e) {
            reject(e);
        }
    })

}
let checkLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: data.email },
                raw: true
            })
            if (user) {
                let check = await bcrypt.compareSync(data.password, user.password);
                if (check) {
                    let token = createAccessToken({ id: user.id, role: user.role })
                    let refreshToken = createRefreshToken({ id: user.id, role: user.role })
                    console.log(refreshToken)
                    // lưu refreshToken vào cookie

                    resolve({
                        user: user,
                        err: 0,
                        message: "ok",
                        token: token,
                        refreshToken: refreshToken
                    })
                }
                else {
                    resolve({
                        err: 2,
                        message: "password false"
                    })
                }
            }
            else {
                resolve({
                    err: 3,
                    message: "user not found"
                })
            }

        }
        catch (e) {
            reject("occcs");
        }
    })
}
let allUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll()
            resolve(users)
        }
        catch (e) {
            reject(e)
        }
    })


}
let findOneById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: true
            })
            if (user) {
                resolve({
                    err: 0,
                    message: "delete success"
                })
            }
            else {
                resolve({
                    err: 1,
                    message: "delete false"
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    checkLogin: checkLogin,
    allUser: allUser,
    findOneById: findOneById,
    createAccessToken: createAccessToken
}