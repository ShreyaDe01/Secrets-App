const express = require('express')
const bodyParser = require('body-parser')
const ejs = require("ejs")
const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
const bcrypt = require('bcrypt')
const saltRounds = 11;

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

mongoose.connect("mongodb://localhost:27017/secrets")

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

const user = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){
    //hash the password
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new user({
            email: req.body.username,
            password: hash
        })
        newUser.save(function(err){
            if(err){
                console.log(err)
            }else{
                res.render("secrets")
            }
        })
    });  
})

app.post("/login", function(req, res){
    const username = req.body.username
    const password = req.body.password
    
    user.findOne({email : username}, function(err, foundUser){
        if(err)
            console.log(err)
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true)
                        res.render("secrets")
                });
            }
        }
    })
})

app.listen(5000, function(){
    console.log("Server started on port 5000")
})