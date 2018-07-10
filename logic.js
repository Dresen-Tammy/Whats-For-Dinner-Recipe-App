const access = require('./access.js');
const fetch = require('node-fetch');
const http = require('http');
const bcrypt = require('../index.js').bcrypt
const session = require('express-session');
var logic = {};




logic.login = function (req, response, next) {
    console.log('logging in')
    var username = req.params.username;
    var password = req.params.password;
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            response.status(500).json({success:false, message: "Error logging in."});
        } else if (result == null || result.length != 1) {
            response.status(200).json({success:false, message: "Username or password is incorrect."});
        } else {
            console.log(password);
            console.log(result[0].password);
            bcrypt.compare(password, result[0].password, function(err,res) {
                if (err) {
                    response.status(500).json({success:false, message: "Error logging in."}); 
                }
                console.log(res);
                if (res == true) {
                    req.session.chef_id = result[0].id;
                    response.json({chef_id: result[0].id})
                } else {
                    response.status(200).json({success:false, message: "Username or password is incorrect."})
                }
            })   
        }
    }) 
}

logic.register = function(req,res) {
    console.log('registering');
    var username = req.body.username;
    var password = req.body.password;
    if (username === null || password === null || username === "" || password === "") {
        res.status(500).json({success:false, message: "Fill in all fields."});
    }
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "error registering."});
        } else if (result === undefined) {
            res.status(400).json({success:false, message: "Username already registered."});
        } else {
                bcrypt.hash(password, 10, function(err, hash){
                    if (err) {throw (err);}
                    access.setPersonInDb(username, hash, function(err, result) {
                        if (err) {
                            res.status(500).json({success:false, message: "Error registering."}); 
                        } else {
                            access.getPersonFromDb(username, function(err, result) {
                                if (err) {
                                    res.status(500).json({success:false, message: "Error registering."}); 
                                } else {
                                    res.json({username: result[0].username});
                                }
                            })
                        }
                    })
                })
            
        }
    })

}


logic.logout = function(req,res) {
    // TODO sign out of session
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        }
        console.log({message: "logged out"});
        res.json({success:true, message: "logged out"});
    })    
}




module.exports = logic;