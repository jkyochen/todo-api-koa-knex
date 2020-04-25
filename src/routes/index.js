const Router = require("koa-router");
const users = require("./users");
const router = new Router();
const api = new Router();
const v1 = new Router();

v1.use("/users", users.routes())

api.use("/v1", v1.routes());
router.use("/api", api.routes());

module.exports = router;