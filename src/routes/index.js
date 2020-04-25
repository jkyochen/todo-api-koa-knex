const Router = require("koa-router");
const users = require("./users");
const todos = require("./todos");
const auth = require('../middlewares/auth');
const router = new Router();
const api = new Router();
const v1 = new Router();

v1.use("/users", users.routes())
v1.use("/todos", auth, todos.routes())

api.use("/v1", v1.routes());
router.use("/api", api.routes());

module.exports = router;