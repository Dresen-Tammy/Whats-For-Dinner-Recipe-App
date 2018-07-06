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
access.getRecipeFromDb = function (recipe_id, callback) {
    console.log('getting recipe');
    var sql = "SELECT id FROM recipe WHERE recipe_id = $1::varchar";
    var params = [recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("an error with the database occured in get recipe");
            console.log(err);
            callback(err, null);
        }
        console.log(result);
        callback(null, result.rows);
    })
}
// get recipeId from database
access.getRecipeIdFromDb = function (id, callback) {
    console.log('getting recipe');
    var sql = "SELECT recipe_id FROM recipe WHERE id = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("an error with the database occured in get recipeId");
            console.log(err);
            callback(err, null);
        }
        console.log(result.rows);
        callback(null, result.rows);
    })
}
// get all recipes from database
access.getAllRecipesFromDb = function(callback) {
    var sql = "SELECT id, recipe_id, title, image_url FROM recipe";
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
    var sql = "SELECT r.id, r.recipe_id, r.title, r.image_url FROM recipe r INNER JOIN favorite f ON r.id = f.rid WHERE f.chef_id = $1::int";
    var params = [chef_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in getFavorites");
            console.log(err);
            callback(err, null);
        } 
        console.log(result.rows);
        callback(null, result);

    })
}
// add favorite to db
access.setFavoriteInDb = function (rid, chef_id, callback) {
    
    var sql = "INSERT INTO favorite VALUES (default, $1::int, $2::int) RETURNING rid";
    var params = [chef_id, rid];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in setFavorite");
            console.log(err);
            callback(err, null);
        } else {
        console.log("Db results: " + JSON.stringify(result.rows));
        callback(null, result.rows);
        }
    })
}
// delete favorite from database
access.deleteFavoriteFromDb = function(chef_id, recipe_id, callback) {
    console.log('deleting from favorite');
    var sql = "DELETE FROM favorite WHERE chef_id = $1::int AND rid = (SELECT id FROM recipe WHERE recipe_id = $2::varchar) RETURNING chef_id";
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
access.setRecipeInDb = function(recipe_id, title, image_url, callback) {
    console.log('adding recipe');
    var sql = "INSERT INTO recipe VALUES (default, $1::varchar, $2::varchar, $3::text) RETURNING id";
    var params = [recipe_id, title, image_url];
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
