const bcrypt = require("bcrypt");
const passport = require("koa-passport");
const User = require("../models/User");

module.exports = {
    Register: async (ctx) => {
        const { username, password } = ctx.request.body;
        const user = await User.transaction(async (trx) => {
            if (await User.query(trx).findOne({ username }).select("id")) {
                ctx.throw(409, { data: { message: "Conflict regsiter user" } });
                return;
            }
            return await User.query(trx).insert({
                username,
                password: await bcrypt.hash(password, 12),
                role: "admin",
            });
        });
        ctx.status = 200;
        ctx.body = {
            data: {
                id: user.id,
            },
        };
    },
    Login: async (ctx) => {
        return passport.authenticate("local", (err, user) => {
            if (!user) {
                ctx.throw(401, {
                    data: { message: "Unauthorized login user" },
                });
                return;
            }
            ctx.login(user);
            ctx.status = 200;
            ctx.body = {
                data: {
                    id: user.id,
                },
            };
        })(ctx);
    },
    Logout: async (ctx) => {
        if (!ctx.isAuthenticated()) {
            ctx.throw(401, {
                data: { message: "Unauthorized login user" },
            });
            return;
        }
        ctx.logout();
        ctx.status = 200;
        ctx.body = {
            data: {
                message: "Logout Success",
            },
        };
    },
};
