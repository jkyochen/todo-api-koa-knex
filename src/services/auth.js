const bcrypt = require("bcrypt");
const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        done(null, await User.query().findOne({ id }));
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.query().findOne({ username });
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
