const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');


app.get("/",  (req,res) => {
res.render('home');
});




app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine' , 'ejs');






app.listen(3000, () => {
console.log("listening on port 3000");
});