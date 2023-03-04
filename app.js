//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser=require('body-parser')
const ejs=require("ejs")
const mongoose=require('mongoose')
const encrypt=require("mongoose-encryption")
const app = express()
console.log(process.env.API_KEY)
const port = 3000

app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true})
const userSchema= new mongoose.Schema({
  email:String,
  password:String
})


userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["password"]})
const User= new mongoose.model("User",userSchema)
app.get('/', (req, res) => {
  res.render('home')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/register', (req, res) => {
  res.render('register')
})
app.post('/login',(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username})
    .then((foundUser)=>{
      if(foundUser){
        if(foundUser.password==password){
          res.render('secrets')
        }
          
      }
    })
    .catch((err)=>{
      console.log(err);
    })
})
app.post('/register',(req,res)=>{
  const newuser=new User({
    email:req.body.username,
    password:req.body.password
  })
  newuser.save()
    .then((x)=>{
      console.log(x)
      res.render("secrets")
    })
    .catch((err)=>{
      console.log(err)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// const article = new User({
  //   email:"xyz@gmail.com",
  //   password:"xyz123"
  // });
//article.save();