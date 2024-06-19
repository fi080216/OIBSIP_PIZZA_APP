const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');

function authController() {
  // Helper function to get the redirect URL based on user role
  const _getRedirectUrl = (req) => {
    return req.user.role === 'admin' ? '/customers/adminOrder' : '/customers/orders';
  };

  return {
    // Render the login page
    login(req, res) {
      res.render("path/login");
    },

    // Handle login POST request
    postLogin(req, res, next) {
      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        req.flash("err", "*Enter the required field ");
        return res.redirect("/login");
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("err", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("err", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash("err", info.message);
            return next(err);
          }
          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },

    // Render the registration page
    register(req, res) {
      res.render("path/register");
    },

    // Handle registration POST request
    async postregister(req, res) {
      const { name, email, password } = req.body;

      // Validate input fields
      if (!name || !email || !password) {
        req.flash("err", "*All the fields are required !");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Check if email already exists
      const userExists = await User.exists({ email: email });
      if (userExists) {
        req.flash("err", "*Email already exists !");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      // Save the user to the database
      user
        .save()
        .then((user) => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("err", "Something went wrong !");
          return res.redirect("/register");
        });
    },

    // Handle logout
    postlogout(req, res) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    },
  };
}

module.exports = authController;
