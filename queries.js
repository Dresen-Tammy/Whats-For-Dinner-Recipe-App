const pgp = require('pg-promise')({}); // require pg-promise, takes extra variable of object.
const conString = process.env.DATABASE_URL;  // connection to database, need to replace with heroku.
const db = pgp(conString);  // use pg to connect to database
const url = require('url'); // url will parse url



// queries is an object hat will ahve several methods. When queries is required in index.js, methods are available
var queries = {};
// createChef method.  Creates new user in chef table
queries.createChef = function (req,res) {
    console.log('hello from createChef');

    const q1 = db.one('INSERT INTO chef VALUES (default, $1, $2) RETURNING username', [username, password])
      .then((q1)=> {
          console.log(q1)
          res.status(200) 
             .json(q1)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"There was an err"})
      })
}
// getChef method in queries. req,res passed in. req includes url from user.
queries.getChef = function (req,res) {
    console.log('hello from getChef');
    var url_parts = url.parse(req.url, true); // parse the url from req
    var query = url_parts.query; // put parts of url into object
    var username = query.username; // get username that user entered from url.
    console.log(username);
    // query database to get information about the user.
    // db.one, db.none, db.any for response will be 1, 0, or multiple rows.
    db.one('SELECT username, password FROM chef WHERE username = $1', [username]) // this returns promise that answer will be returned
      .then((results)=> { // when results come, executes this callback function
          console.log(results)
          res.status(200) // turn results into json string
             .json(results)
      })
      .catch((err)=> { // if there is an error, catch handles it
        console.log(err)
        res.status(400)
           .json({"error":"There was an error. Try again"}) // response sent as json string
      }) // result will be returned from ajax request in main.js, so it can be processed.
}


module.exports = queries;