const pg = require('pg-promise')({}); // require pg-promise, takes extra variable of object.

var conString = 'postgres://localhost:5432/recipes' //'process.env.DATABASE_URL';  // connection to database, need to replace with heroku.
//var remote = require('remoteAPI');    
const db = pg(conString);  // use pg to connect to database
const url = require('url'); // url will parse url

// queries is an object hat will ahve several methods. When queries is required in index.js, methods are available
var queries = {};
// createChef method.  Creates new user in chef table
queries.checkChef = function (req, res, next) {
    var username = req.body.username;
     db.none('SELECT id FROM chef WHERE id = $1', [username])
    .then((result) => {
        next();
    })
    .catch((err)=> {
        res.status(400)
           .json({"Error": err})

    })
}
queries.createChef = function (req,res) {
    console.log('hello from createChef');
    // get post data from req, 
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    const q1 = db.one('INSERT INTO chef VALUES (default, $1, $2) RETURNING username', [username, password])
      .then((q1)=> {
          console.log(q1)
          res.status(200) 
             .json(q1) // TODO: Figure out how to send without double double quotes.
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
// getFavorites pass in username and return recipe name and recipe id.
queries.getFavorites = function (req,res) {
    console.log('hello from getFavorites');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var user_id = query.chef_id;
    db.any('SELECT r.id, r.recipe_name, r.imageurl, r.f2f_rid  FROM recipe r INNER JOIN favorite f ON r.id = f.recipe_id' +
' WHERE f.chef_id = $1', [user_id])
      .then((results)=> {
          console.log(results)
          res.status(200)
             .json({"message":results})
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"There was an error."})
      })
}
// addFavorites adds recipe, ingredients, and favorite.
queries.addFavorite = function (req,res) {
    console.log('hello from addFavorites');
    var recipe_name = req.body.recipe_name;
    var rid = req.body.rid;
    var imageurl = req.body.imageurl;
    var chef_id = req.body.chef_id;
     db.tx(t => {
        
        return t.batch([
            t.one('INSERT INTO recipe VALUES (default, $1, $2, $3) RETURNING recipe_name', [rid, recipe_name, imageurl]),
            t.none('INSERT INTO favorite VALUES (default, $1, (SELECT id FROM recipe WHERE recipe_name = $2))', [chef_id, recipe_name])
        ]);
    }) 
     .then(data => {
         res.status(200)
           .json({"message": data}); 
    })
    .catch(error => {
        res.status(400)
           .json({"error":"There was an error"})
    }); 

} 
/* // addFavorites adds recipe, ingredients, and favorite.
queries.addFavorite = function (req,res) {
    console.log('hello from addFavorites');
    var recipe_name = req.body.recipe_name;
    var category_id = req.body.category_id;
    var rid = req.body.rid;
    var source = req.body.source;
    var imageurl = req.body.imageurl;
    var ingredient = req.body.ingredient;
    console.log(ingredient); // ingredient must be inserted like this {"item1", "item2", "item3"} Don't put quotes surrounding.
     
     db.tx(t => {
        
        return t.batch([
            t.one('INSERT INTO recipe VALUES (default, $1, $2, $3, $4, $5, $6) RETURNING recipe_name', [category_id, rid, recipe_name, source, imageurl, ingredient]),
            t.none('INSERT INTO favorite VALUES (default, $1, (SELECT id FROM recipe WHERE recipe_name = $2))', [chef_id, recipe_name])
        ]);
    }) 
     .then(data => {
         res.status(200)
           .json({"message": data}); 
    })
    .catch(error => {
        res.status(400)
           .json({"error":"There was an error"})
    }); 

}  */
// delete Favorite
queries.deleteFavorite = function (req,res) {
    var recipe_id = req.body.recipe_id;
    var chef_id = req.body.chef_id;
    console.log(recipe_id);
    console.log(chef_id);

    // delete from favorite, then delete ingredients, then delete from recipe
    
    db.none('DELETE FROM favorite WHERE recipe_id = $1 AND chef_id = $2', [recipe_id, chef_id])      
      .then((results) =>{
        res.status(200)
           .json({"message": "Success"});
    })
    .catch((err) => {
        res.status(400)
           .json({"error":"There was an error"})
})
}
//getRecipe
queries.getRecipe = function (req, res) {

}

module.exports = queries;

