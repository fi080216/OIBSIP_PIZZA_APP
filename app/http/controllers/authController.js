const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');

function authController() {
  const _getRedirectUrl = (req) =>{
return req.user.role === 'admin' ? '/customers/adminOrder' : '/customers/orders'
  }
  return {

    




    login(req, res) {
      res.render("path/login");
    },

    postLogin(req, res, next) {

      const { email, password } = req.body;
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
      })
      (req, res, next);
    },

    

    register(req, res) {
      res.render("path/register");
    },

    async postregister(req, res) {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        req.flash("err", "*All the fields are required !");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      User.exists({ email: email }).then((result) => {
        if (result) {
          req.flash("err", "*Email already exists !");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      const hashedpassword = await bcrypt.hash(password, 10);

      const user = new User({
        name: name,
        email: email,
        password: hashedpassword,
      });
      user
        .save()
        .then((user) => {
          return res.redirect("/login");
        })
        .catch((err) => {
          req.flash("err", "Something went wrong !");
        });


        




    },

      postlogout(req,res){
      req.logout();
      res.redirect('/')

    },

    



    
  };
}

module.exports = authController;
