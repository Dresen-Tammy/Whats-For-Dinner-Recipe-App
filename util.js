// Devin Cenatiempo helped me with this.
const crypto = require('crypto'); 
const validator = require('email-validator'); 
let util = {};  
util.getSalt = () => {   
    let salt;   
    salt = crypto.randomBytes(16).toString('base64');   
    return salt; 
}  
util.getHash = (salt, password) => {   
    let hash = crypto.createHmac('sha512', salt);   
    hash.update(password);   var value = hash.digest('hex');   
    return value; 
}  
util.isEmailValid = validator.validate;  
module.exports = util;