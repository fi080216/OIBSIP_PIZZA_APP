const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");

app.use(express.static('public'))




app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render('home');
});

app.get("/cart", (req, res)=>{
  res.render('customers/cart');
})

app.get('/login', (req,res)=>{
  res.render('path/login')
})

app.get('/register', (req,res)=>{
  res.render('path/register')
})

app.listen(3000, () => {
  console.log("listening on port 3000");
});
