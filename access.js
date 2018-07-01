const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://recipeuser:password@localhost:5432/recipes";
const pool = new Pool({connectionString: connectionString});



// access is an object hat will ahve several methods. When access is required in index.js, methods are available
var access = {};
// get one chef from the database
access.getPersonFromDb = function (username, callback) {
        console.log('Back from the getPersonFromDb function with username: ', username);
        var sql = "SELECT id, username, password FROM chef WHERE username = $1::varchar";
        var params = [username];
        pool.query(sql, params, function(err, result){
            if (err) {
                console.log("An error with the database occured");
                console.log(err);
                callback(err, null);
            }
            console.log("Found DB result: " + JSON.stringify(result.rows));
            callback(null, result.rows);
        })
    }

// insert chef into database
access.setPersonInDb = function (username, password, callback) {
    console.log('setting person');
    var sql = "INSERT INTO chef VALUES (default, $1::varchar, $2::varchar)";
    var params = [username, password];
    pool.query(sql, params, function(err, result){
        if (err) {
            console.log("An error with the database occured");
            console.log(err);
            callback(err, null);
        } 
        console.log("inserted into database") ;
        callback(null, result);
        
    })
}
// get recipe from database
access.getRecipeFromDb = function (f2f_rid, callback) {
    console.log('getting recipe');
    var sql = "SELECT id FROM recipe WHERE f2f_rid = $1::int";
    var params = [f2f_rid];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("an error with the database occured in get recipe");
            console.log(err);
            callback(err, null);
        }
        console.log("Found DB result:" + JSON.stringify(result.rows));
        callback(null, result.rows);
    })
}
// get all recipes from database
access.getAllRecipesFromDb = function(callback) {
    var sql = "SELECT id, f2f_rid, recipe_name, imageurl FROM recipe";
    pool.query(sql, function(err, result) {
        if (err) {
            console.log("an error with database occurred");
            console.log(err);
            callback(err, null);
        }
        console.log("Db results: " + JSON.stringify(result.rows));
        callback(null, result);
    })
}
// get favorites from db
access.getFavoritesFromDb = function (chef_id, callback) {
    var sql = "SELECT r.id, r.f2f_rid, r.recipe_name, r.imageurl FROM recipe r INNER JOIN favorite f ON r.id = f.recipe_id WHERE f.chef_id = $1::int";
    var params = [chef_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in getFavorites");
            console.log(err);
            callback(err, null);
        } 
        console.log("Found DB result: " + JSON.stringify(result.rows));
        callback(null, result);

    })
}
// add favorite to db
access.setFavoriteInDb = function (recipe_id, chef_id, callback) {
    console.log("recipe_id inside setFav", recipe_id);
    var sql = "INSERT INTO favorite VALUES (default, $1::int, $2::int) RETURNING id";
    var params = [chef_id, recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in setFavorite");
            console.log(err);
            callback(err, null);
        } else {
        console.log("Db results: " + JSON.stringify(result.rows));
        callback(null, result);
        }
    })
}
// delete favorite from database
access.deleteFavoriteFromDb = function(chef_id, recipe_id, callback) {
    console.log('deleting from favorite');
    var sql = "DELETE FROM favorite WHERE chef_id = $1::int AND recipe_id = $2::int";
    var params = [chef_id, recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred");
            console.log(err);
            callback(err, null);
            
        } else {
            callback(null, result);
    }
    })
}
// add recipe to db
access.setRecipeInDb = function(f2f_rid, recipe_name, imageurl, source, ingredients, callback) {
    console.log('adding recipe');
    var sql = "INSERT INTO recipe VALUES (default, $1::int, $2::varchar, $3::text, $4::text, $5::text[]) RETURNING id";
    var params = [f2f_rid, recipe_name, imageurl, source, ingredients];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occured in set recipe");
            callback(err, null);
        }
        console.log("Found DB result " + JSON.stringify(result.rows));
        callback(null, result);
    })
}
    module.exports = access;
