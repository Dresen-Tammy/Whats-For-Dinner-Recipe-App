// logic for logging in, registering, logging out

// import dbAccess to db
const dbAccess = require('./dbAccess.js');
// uses crypto to salt and hash passwords
const {getSalt, getHash} = require('./util');

var logic = {};

logic.register = function(req,res) {
    var username = req.body.username;
    dbAccess.getPersonFromDb(username, function(err, result) { // see if person is in db
        if (err) { // if err, return error message
            console.log("error registering");
            res.status(500).json({success:false, message: "error registering. Please try again."});
        } else if (result[0]) { // if username is already in database, return error message
            console.log('username already exists');
            res.status(401).json({success:false, message: "Username already registered. Login or choose a different username."});
        } else {
            console.log('username not taken, registering');
                    var username = req.body.username; 
                    var password = req.body.password;   
                    var salt = getSalt();
                    var hash = getHash(salt, password);
                    dbAccess.setPersonInDb(username, hash, salt, function(err, result) {
                        if (err) {
                            res.status(500).json({success:false, message: "Error registering. Please try again"}); 
                        } else {
                            res.json({username: result[0].username}); 
                          
                        }
                    })
                
            
        }
    })

}

logic.login = function (req, res, next) {
    console.log('logging in')
    var username = req.body.username;
    var pword = req.body.password;
    if (!username || !pword) {
        res.status(500)
           .json({success:false, message: "Please fill in all fields."})
    }
    dbAccess.getPersonFromDb(username, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "Error logging in. Please try again"});
        } else if (result == null || result.length != 1) {
            console.log('wrong username');
            res.status(401)
               .json({success:false, message: "Username or password is incorrect."});
        } else {
            console.log('checking password');
            let password = result[0].password;
            let hash = getHash(result[0].salt, req.body.password);
            //console.log("Hashed password", hash);
            //console.log(hash);
               if (hash == password) { 
                    req.session.chef_id = result[0].id;
                    res.json({chef_id: result[0].id})
                } else {
                    res.status(401)
                       .json({success:false, message: "Username or password is incorrect."})
                }  
        }
    }) 
}



logic.logout = function(req,res) {
    // TODO sign out of session
    console.log('logging out');
    if(req.session.chef_id != null) {
    req.session.destroy((err) =>{
        if (err) {
            res.json({success: false, message: "Error logging out."})
        } else {
            if (!req.session) {
                console.log({message: "logged out"});
                res.json({success:true, message: "Logged out."});
            } else {
                res.status(401)
                   .json({success: false, message: "Error logging out."});
            }
        
        }
    })    
    } else {
        res.status(401)
           .json({success: false, message: "Error logging out."});
    }
}




module.exports = logic;
