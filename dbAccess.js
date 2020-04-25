const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://recipeuser:password@localhost:5432/recipes";
const pool = new Pool({connectionString: connectionString});



// dbAccess is an object that has several methods. When dbAccess is required in index.js, methods are available
var dbAccess = {};
// get one chef from the database
dbAccess.getPersonFromDb = function (username, callback) {
        console.log('Back from the getPersonFromDb function with username: ', username);
        var sql = "SELECT id, username, password, salt FROM chef WHERE username = $1::varchar";
        var params = [username];
        pool.query(sql, params, function(err, result){
            if (err) {
                console.log("An error with the database occured while gettin person");
                callback(err, null);
            } else {
            console.log("Got person from db");
            console.log(result.rows);
            callback(null, result.rows);
            }
        })
    }

// insert chef into database
dbAccess.setPersonInDb = function (username, password, salt, callback) {
    console.log('setting person');
    var sql = "INSERT INTO chef VALUES (default, $1::varchar, $2::varchar, $3::varchar) RETURNING username";
    var params = [username, password, salt];
    pool.query(sql, params, function(err, result){
        if (err) {
            console.log("An error with the database occured while setting person");
            callback(err, null);
        } else {
        console.log("inserted person into database") ;
        console.log(result.rows);
        callback(null, result.rows);
        }
    })
}
// get recipe from database
dbAccess.getRecipeFromDb = function (recipe_id, callback) {
    console.log('getting recipe');
    var sql = "SELECT id FROM recipe WHERE recipe_id = $1::varchar";
    var params = [recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("an error with the database occured in get recipe");
            callback(err, null);
        } else {
            console.log('recipe retrieved from database')
            callback(null, result.rows);
        }
    })
}
// get recipeId from database
dbAccess.getRecipeIdFromDb = function (id, callback) {
    console.log('getting recipe');
    var sql = "SELECT recipe_id FROM recipe WHERE id = $1::int";
    var params = [id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("an error with the database occured in get recipeId");
            callback(err, null);
        } else {
            console.log('recipe id retrieved from database.')
            callback(null, result.rows);
        }
    })
}
// get all recipes from database
dbAccess.getAllRecipesFromDb = function(callback) {
    var sql = "SELECT id, recipe_id, title, image_url as image FROM recipe";
    pool.query(sql, function(err, result) {
        if (err) {
            console.log("an error with database occurred");
            console.log(err);
            callback(err, null);
        } else {
            console.log("all recipes retrieved from database");
            callback(null, result);
        }
    })
}
// get favorites from db
dbAccess.getFavoritesFromDb = function (chef_id, callback) {
    var sql = "SELECT r.id as faveId, r.recipe_id as id, r.title, r.image_url as image FROM recipe r INNER JOIN favorite f ON r.id = f.rid WHERE f.chef_id = $1::int";
    var params = [chef_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in getFavorites");
            callback(err, null);
        } else {
            console.log("Favorites retrieved from database.")
            callback(null, result);
        } 
        
        

    })
}
dbAccess.getFavoriteByTitle = function (chef_id, recipe_id, callback) {
    var sql = "SELECT id FROM favorite WHERE chef_id = $1::int AND rid = (SELECT id FROM recipe WHERE recipe_id = $2::varchar)";
    var params = [chef_id, recipe_id];
    console.log(chef_id);
    console.log(recipe_id);
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error occured in getFavoritesByTitle");
            callback(err, null);
        } else {
            console.log('Success in getFavoritesByTitle');
            callback(null, result.rows);
        }
        
    })
}
// add favorite to db
dbAccess.setFavoriteInDb = function (recipe_id, chef_id, callback) {
    
    var sql = "INSERT INTO favorite VALUES (default, $1::int, (SELECT id FROM recipe WHERE recipe_id = $2::varchar))";
    var params = [chef_id, recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred in setFavorite");
            callback(err, null);
        } else {
            console.log("Success in setFavorite");
            callback(null, result);
        }
    })
}
// delete favorite from database
dbAccess.deleteFavoriteFromDb = function(chef_id, recipe_id, callback) {
    console.log('deleting from favorite');
    var sql = "DELETE FROM favorite WHERE chef_id = $1::int AND rid = (SELECT id FROM recipe WHERE recipe_id = $2::varchar) RETURNING chef_id";
    var params = [chef_id, recipe_id];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occurred");
            callback(err, null);
            
        } else {
            console.log("favorite deleted from database")
            callback(null, result);
        }
    })
}
// add recipe to db
dbAccess.setRecipeInDb = function(recipe_id, title, image_url, callback) {
    console.log('adding recipe');
    var sql = "INSERT INTO recipe VALUES (default, $1::varchar, $2::varchar, $3::text) RETURNING id";
    var params = [recipe_id, title, image_url];
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error with the database occured in set recipe");
            callback(err, null);
        } else {
            console.log("Found DB result " + JSON.stringify(result.rows));
            callback(null, result);
        }
    })
}
    module.exports = dbAccess;
