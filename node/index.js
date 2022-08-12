var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
const mongoURI = require('./config/config')
const mongoose = require("mongoose");
var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(mongoURI.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

var Users = require("./router/userRoute");

app.use("/customer", Users);



app.listen(port, function () {
    console.log("Server is running on port: " + port);
});
