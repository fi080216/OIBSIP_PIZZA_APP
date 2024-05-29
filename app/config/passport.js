const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "No user found." });
        }
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged In successfully" });
            }

            return done(null, false, {
              message: "Incorrect username or password !",
            });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong !" });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const des = await User.findById(id); 
      done(null, des);
    });
  

  
}

module.exports = init;
