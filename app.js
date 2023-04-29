require("dotenv").config();
require("./config/database").connect();
const express = require("express");
// const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var cors = require('cors')
// const bcrypt = require('bcrypt');
// const User = require("./model/user");
const auth = require("./middleware/auth");
const app = express();

//for data-manage
// var bodyParser = require('body-parser');
// const ObjectId = require('mongodb').ObjectId;
// const {MongoClient}=require('mongodb');
// const uri = process.env.uri;
// const client = new MongoClient('mongodb://localhost:27017',{ useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
// const collection = client.db("admin").collection("Users");

app.use(cors())
app.use(express.json());
app.use(cookieParser());  

app.use(require('./controllers/auth.controller'));

app.use(auth);
app.get("/welcome", async (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.use(require('./controllers/data.controller'))



module.exports = app;