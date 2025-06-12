const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const userModule = require('../modules/userModule');


passport.serializeUser(async (user, done) => {
    console.log('Сериализация');
    done(null, user);
});

passport.deserializeUser(async (email, done) => {
    console.log('Десериализация');
    await userModule.findByEmail(email)
    .then((targetUser) => {
        const user = targetUser ? targetUser : false;
        done(null, targetUser);
    });
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    console.log(password)
    await userModule.findByEmail(email)
        .then((targetUser) => {
            bcrypt.compare(password, targetUser[0].passwordHash, (err, checkResult) => {
                if (checkResult) {
                    return done(null, targetUser[0]);
                }
                else {
                    return done(null, false);
                }
            });
        })
        .catch(() => {
            return done(null, false);
        })
    })
);