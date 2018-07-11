const access = require('./access.js');
const fetch = require('node-fetch');
const http = require('http');
const {isEmailValid, getSalt, getHash} = require('./util');
//const bcrypt = require('bcrypt');

//var crypto = require('crypto'),
 // algorithm = 'aes-256-ctr',
 // password = '5th7LreP';

const session = require('express-session');
var logic = {};




logic.login = function (req, response, next) {
    console.log('logging in')
    var username = req.body.username;
    var pword = req.body.password;
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            response.status(500).json({success:false, message: "Error logging in."});
        } else if (result == null || result.length != 1) {
            response.json({success:false, message: "Username or password is incorrect."});
        } else {
            console.log(pword);
            console.log(result[0].salt);
            let password = result[0].password;
            let hash = getHash(result[0].salt, req.body.username);
            console.log(hash);
           // var decipher = crypto.createDecipher(algorithm, password)
           // var dec = decipher.update(result[0].password, 'hex', 'utf8')
           // dec += decipher.final('utf8');
           // if (req.params.password === dec) {
               if (hash == password) { 
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
                    var username = req.body.username; 
                    var password = req.body.password;   
                    var salt = getSalt();
                    var hash = getHash(salt, password);
                    access.setPersonInDb(username, hash, salt, function(err, result) {
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
    if(req.session.chef_id != null) {
    req.session.destroy((err) =>{
        if (err) {
            res.json({success: false})
        } else {
        console.log({message: "logged out"});
        res.json({success:true, message: "logged out"});
        }
    })    
    } else {
        res.json({success: false});
    }
}




module.exports = logic;