const Router = require("koa-router");
const auth = require('../middlewares/auth');
const { Register, Login, Logout } = require("../controllers/user");

module.exports = new Router()
    .post("/register", Register)
    .post("/login", Login)
    .get("/logout", auth, Logout)
