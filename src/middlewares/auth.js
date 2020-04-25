const bcrypt = require("bcrypt");
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

const tableNames = require("../constants/tableNames");
const knex = require("../db/config");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        done(null, await knex(tableNames.user).where({ id }).first());
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await knex(tableNames.user)
                .where({ username })
                .first();
            if (!user || !(await bcrypt.compare(password, user.password))) {
                done(null, false);
                return;
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    })
);
