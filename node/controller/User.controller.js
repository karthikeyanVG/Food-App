const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
process.env.SECRET_KEY = "secret";

const User = require('../model/User');

//Registration user
exports.register = (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                if (userData.password === userData.confirmPassword) {
                    bcrypt.hash(req.body.password && req.body.confirmPassword, 10, (err, hash) => {
                        userData.password = hash;
                        userData.confirmPassword = hash
                        User.create(userData)
                            .then(user => {
                                res.json({ email: user.email + " is Registered!" });
                            })
                            .catch(err => {
                                res.send("error: " + err);
                            });
                    });
                } else {
                    res.json("Password mismatch");
                }

            } else {
                res.json({ error: "User already exists" });
            }
        })
        .catch(err => {
            res.send("error: " + err);
        });
};

//customer Login 
exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // Passwords match
                    const payload = {
                        _id: user._id,
                        username: req.body.username,
                        email: user.email,
                        phone: user.phone,
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: '1h'
                    });
                    res.send(token);
                } else {
                    // Passwords don't match
                    res.json({ error: "password Invalid" });
                }
            } else {
                res.json({ error: "you are not register" });
            }
        })
        .catch(err => {
            res.send("error: " + err);
        });
};

//get user
exports.get_user = (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SECRET_KEY
    );

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.send("User does not exist");
            }
        })
        .catch(err => {
            res.send("error: " + err);
        });
};
