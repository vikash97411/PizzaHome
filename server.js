require('dotenv').config()
const express = require("express")
const upload = require("express-fileupload")
const app=  express()
const ejs= require("ejs")
const path=require("path")
const expressLayout =require("express-ejs-layouts")
const PORT=process.env.PORT || 3000 
var mongoose = require('mongoose');
const session=require('express-session')
const flash=require("express-flash")
const MongoDbStore=require("connect-mongo")
const passport = require('passport')
const Emitter = require('events')


//Set up default mongoose connection
var url=process.env.MONGO_URI;
//var url = 'mongodb://127.0.0.1/pizza';
mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
 //Get the default connection
var db = mongoose.connection;
db.on('open',()=>{
    console.log("Database connected");
})
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//file upload

//Event emitter

const eventEmitter =new Emitter()
app.set('eventEmitter',eventEmitter)

//session config

app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl:url,
         collection:'sessions'
}),
    saveUninitialized:false,
    cookie:{maxAge: 1000 * 60 * 60 * 24}  //one day
}))

//passport config
const passportInit=require('./app/config/passport')
const { TRUE } = require('sass')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(expressLayout);
app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.json())
app.use(upload({useTempFiles:true}))
//global middelware
app.use((req,res,next)=>{
res.locals.session=req.session
res.locals.user=req.user
next()
})
app.use(express.urlencoded({extended:false}))
app.set('views',path.join(__dirname,'resources/views'))


require("./routes/web")(app)
app.use((req,res)=>{
    res.status(404).send(`<h1>Page not found ,404 error!</h1>`)
})
//file upload


const server = app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})

let io = require('socket.io')(server)

io.on('connection',(socket)=>{
    socket.on('join',(orderId)=>{
        socket.join(orderId)
        console.log("joined room",orderId);
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})
