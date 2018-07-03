const access = require('./access.js');
const fetch = require('node-fetch');
const http = require('http');
const food_url = 
var logic = {};




logic.login = function (req, res) {
    console.log('logging in')
    var username = req.params.username;
    var password = req.params.password;
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "Error logging in."});
        } else if (result == null || result.length != 1) {
            res.status(500).json({success:false, message: "Username or password is incorrect."});
        } else {
            if (result[0].password == password) {
                console.log(result[0]);
                res.json({id: result[0].id, username: result[0].username});
            }
            else {
                res.status(500).json({success:false, message: "Username or password is incorrect."})
            }
            
        }
    }) 
}

logic.register = function(req,res) {
    console.log('registering');
    var username = req.body.username;
    var password = req.body.password;
    if (username == null || password == null) {
        res.status(500).json({success:false, message: "Fill in all fields."});
    }
    access.getPersonFromDb(username, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "error registering."});
        } else if (result === undefined) {
            res.status(500).json({success:false, message: "Username already registered."});
        } else {
            access.setPersonInDb(username, password, function(err, result) {
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
logic.getFavorites = function(req,res) {
    console.log('getting favorites');
    var chef_id = req.params.chef_id;
    access.getFavoritesFromDb(chef_id, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "Error getting favorites"});
        }
        else {
            res.json(result);
        }
    })
}

/* logic.addFavorite = function(req, res) {
    console.log('addingFavorite');
    var chef_id = req.body.chef_id;
    var f2f_rid = req.body.f2f_rid;
    var recipe_id = req.body.recipe_id;
    var recipe_name = req.body.recipe_name;
    var imageurl = req.body.imageurl;
    var source = req.body.source;
    var ingredients = req.body.ingredient;
    // check to make sure vars are not empty
     if (chef_id == undefined || f2f_rid == undefined || recipe_name == undefined || imageurl == undefined ) {
        res.status(500).json({success:false, message: "Error Empty fields."});
    } else {
        // check to see if recipe is in database.
        access.getRecipeFromDb(f2f_rid, function(err, result) {
            
            if (err) {
                res.status(500).json({success:false, message: "error getting recipe."});
            } else if (result[0] !== undefined) {
                console.log('recipe in db');
            } else {   
                // if not in database, add it, and save the recipe_id.
                console.log("not in database");
                access.setRecipeInDb(f2f_rid, recipe_name, imageurl, source, ingredients, function(err, result) {
                    if(err) {
                        console.log(err);
                    } else {
                        recipe_id = result.rows[0].id;
                        console.log(recipe_id);
                    }
                })
            }
            // save to favorites.
            access.setFavoriteInDb(recipe_id, chef_id, function(err, result) {
                if (err) {
                    res.status(500).json({success:false, message: "Error setting favorite."});
                } else {
                    res.json({success:true, message: "Added to favorites"})
                }
            })
        })
    }
} */
logic.deleteFavorite = function (req, res) {
    const chef_id = req.body.chef_id;
    const recipe_id = req.body.recipe_id;
    if(recipe_id == undefined|| chef_id == undefined) {
        res.status(500).json({success:false, message:"Fill in all fields"});
    }
    access.deleteFavoriteFromDb(chef_id, recipe_id, function(err, result) {
        if (err) {
            res.status(500).json({success:false, message:"Error deleting recipe from favorites"});
        } else {
            res.json({success:true, message:"Deleted from favorite"});
        }
    })
}       
    
    
logic.getAllRecipes = function(req, res) {
    console.log("in logic");
    access.getAllRecipesFromDb(function(err, result) {
        if (err) {
            res.status(500).json({success:false, message: "Error getting recipes from database"})
        } else {
            res.json(result);
        }
    })
}

logic.searchRecipes = function(req, res) {
    const keyword = url.parse(req.url, true).search;
    const key = process.env.FTF_KEY;
    const url = "http://food2fork.com/api/search?key=" + key + "&q=" + keyword;
    console.log(url);
    fetch(url).then(function(result) {
        return result.json();
    }).then(response => response.json())
    .then(data => console.log(data));   
    }
    
logic.viewRecipe = function(req, res) {
    const f2f_rid = req.params.f2f_rid;
    const key = process.env.F2F_KEY;
    const url = "http://food2fork.com/api/get?key=" + key + "&rId=" + f2f_rid; 
    fetch(url).then(function(result) {
        return result.json();
    }).then(function(json) {
        res.json(json);
    })
}







logic.addFavorite = function(req, res) {
    console.log('addingFavorite');
    var chef_id = req.body.chef_id;
    var f2f_rid = req.body.f2f_rid;
    var recipe_name = req.body.recipe_name;
    var imageurl = req.body.imageurl;
    var source = req.body.source;
    var ingredients = req.body.ingredients;
    // check to make sure vars are not empty
     if (chef_id == undefined || f2f_rid == undefined || recipe_name == undefined || imageurl == undefined || source == undefined || ingredients == undefined) {
        res.status(500).json({success:false, message: "Error adding to favorites 1."});
    } else {
        // check to see if recipe is in database.
        access.getRecipeFromDb(f2f_rid, function(err, result) {
            if (err) {
                res.status(500).json({success:false, message: "error adding to favorites 2."});
            } else if (result[0] !== undefined) {
                let recipe_id = result[0].id;
                console.log(recipe_id);
                console.log(chef_id);
                access.setFavoriteInDb(recipe_id, chef_id, function(err, result) {
                    if (err) {
                        res.status(500).json({success:false, message: "Error adding to favorites 3."});
                    } else {
                        res.json({success:true, message: "Added to favorites"})
                    }
                })     
            
            } else {   
                // if not in database, add it, and save the recipe_id.
                console.log("not in database");
                access.setRecipeInDb(f2f_rid, recipe_name, imageurl, source, ingredients, function(err, result) {
                    if(err) {
                        console.log(err);
                    } else {

                        let recipe_id = result.rows[0].id;
                        console.log(recipe_id);
                        console.log(chef_id);
                        access.setFavoriteInDb(recipe_id, chef_id, function(err, result) {
                            if (err) {
                                res.status(500).json({success:false, message: "Error adding to favorites 3."});
                            } else {
                                res.json({success:true, message: "Added to favorites"})
                            }
                        })     
                    }
                })
            }
        
        })
    }
}




module.exports = logic;