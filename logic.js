const access = require('./access.js');
const fetch = require('node-fetch');
const http = require('http');
//const bcrypt = require('bcrypt');
//var crypto = require('crypto'),
  //  algorithm = 'aes-256-ctr',
  //  password = '5th7LreP';

const session = require('express-session');
var logic = {};




logic.login = function (req, response, next) {
    console.log('logging in')
    var username = req.params.username;
    var pword = req.params.password;
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            response.status(500).json({success:false, message: "Error logging in."});
        } else if (result == null || result.length != 1) {
            response.status(200).json({success:false, message: "Username or password is incorrect."});
        } else {
            console.log(pword);
            console.log(result[0].password);
           // var decipher = crypto.createDecipher(algorithm, password)
           // var dec = decipher.update(result[0].password, 'hex', 'utf8')
           // dec += decipher.final('utf8');
           // if (req.params.password === dec) {
               if (req.params.password == result[0].password) { 
                    req.session.chef_id = result[0].id;
                    response.json({chef_id: result[0].id})
                } else {
                    response.status(200).json({success:false, message: "Username or password is incorrect."})
                }  
        }
    }) 
}

logic.register = function(req,res) {
    console.log('registering');
    var username = req.body.username;
    var pword = req.body.password;
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "error registering."});
        } else if (result === undefined) {
            res.status(400).json({success:false, message: "Username already registered."});
        } else {
                //var cipher = crypto.createCipher(algorithm, password);
                //var crypted = cipher.update(req.body.password, 'utf8', 'hex')
                //crypted += cipher.final('hex');
                //access.setPersonInDb(username, crypted, function(err, result) {
                    access.setPersonInDb(username, req.body.password, function(err, result) {
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