const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const knex = require("./db/config");

const options = {};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        done(null, await knex("user").where({ id }).first());
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = await knex("user").where({ username }).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            done(null, false);
            return;
        }
        done(null, user);
    })
);
