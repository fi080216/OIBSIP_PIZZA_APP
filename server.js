const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv/config");
const session = require("express-session");
const flash = require('express-flash');
const MongoDbStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const bodyParser = require('body-parser')
const Emitter = require('events')
// const app1 = require('./resources/js/app');



const connectionString = process.env.MONGODB_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined");
}

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });


   
  // app.use(express-session())

const store = new MongoDbStore({
  uri: connectionString,
  collection: 'session'
});


const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: store,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
const passportInit = require('./app/config/passport')
   passportInit(passport)
  app.use(passport.initialize())
  app.use(passport.session())



// app.use('connect-session')
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  

  next()
})

app.use(expressLayout);
app.set("views", path.join(__dirname, '/resources/views'));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.use((req, res)=>{
  res.status(404).send('<h1>404 Page Not Found!</h1>')
}
)












const server = app.listen(3300, () => {
  console.log("listening on port 3300");
});


const io = require('socket.io')(server)

io.on('connection', (socket)=>{

  // console.log(socket.id)
  socket.on('join', (orderId) =>{
    // console.log(orderId)
socket.join(orderId)
  })

})

eventEmitter.on('orderUpdated', (data)=>{
io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data)=>{
  io.to(`adminRoom`).emit('orderPlaced', data)
  })