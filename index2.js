// require modules
const express = require('express');
const path = require('path');
const validate = require('express-validator');
const url = require('url');
const queries = require('./queries.js');
//const remote = require('./remoteAPI');
const bodyParser = require('body-parser');
const app = express();
var mongojs = require('mongojs');
var db = mongojs('myRecipes',['chefs']);
var ObjectId = mongojs.ObjectId;

// set up port listening
const PORT = process.env.PORT || 5000;

// specify where views are retrieved from
app.set('views', path.join(__dirname, 'views'));
// specify view engine
app.set('view engine', 'ejs');
// specify where static files should be retrieved from
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false})); // supports encoded bodies
app.use(bodyParser.json()); // supports json encoded bodies
app.use(validate({
    errorformatter: function(param, msg, value) {
        var namespace = param.split('.')
        ,root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + '[';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
// Global vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
})

app.get('/', function(req,res) {

})
/* // set up web service endpoints
// when user navigate website with no extensions, login page will be delivered
app.get('/', (req,res)=> res.render('pages/login'));

// register for new user
app.post('/register', queries.checkChef, queries.createChef); // working

// login user
app.get('/login', queries.getChef); // working

// search for recipes GET request, use Food2Fork, requires keyword or ingredinet
// example query  http://food2fork.com/api/get?key=ca9b3bf940c9d4bc3928057e439d6564&q=shredded%20chicken
app.get('/search', (req,res )=>
 res.send('getSearch sent to index.js'));

// add Favorite POST 
app.post('/addFavorite', queries.addFavorite); //working
// addFriendFavorite


// delete from Favorites DELETE request, requires recipe id. Will delete recipe id from favorites table,
// delete ingredients from ingredients table, delete recipe from recipe table.
app.delete('/deleteFavorite', queries.deleteFavorite);
// view favorites list GET request, requires user id, returns list of favorites.
app.get('/favorites', queries.getFavorites);
// view specific recipe not in favorites GET request, use Food2Fork, requires recipe id
// example query http://food2fork.com/api/get?key=ca9b3bf940c9d4bc3928057e439d6564&rId=35120
app.get('/oneRecipe', (req, res) =>{
    res.send('oneRecipe sent to index.js')
});
// view individual recipe in favorites GET request, requires recipe id and returns recipe from database.
app.get('/recipe', (req, res) =>{
    res.send('recipe sent to index.js')
});
// logout  not sure what kind of request.
app.get('/logout', (req,res)=>{
    res.send('logout request sent to index.js')
});
/* function login(req, res) {
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
} */
/* function getPersonFromDb(username, callback) {
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
} */
/* // set up web service endpoints
// when user navigate website with no extensions, login page will be delivered
app.get('/', (req,res)=> res.render('pages/login'));

// register for new user
app.post('/register', queries.checkChef, queries.createChef); // working

// login user
app.get('/login', queries.getChef); // working

// search for recipes GET request, use Food2Fork, requires keyword or ingredinet
// example query  http://food2fork.com/api/get?key=ca9b3bf940c9d4bc3928057e439d6564&q=shredded%20chicken
app.get('/search', (req,res )=>
 res.send('getSearch sent to index.js'));

// add Favorite POST 
app.post('/addFavorite', queries.addFavorite); //working
// addFriendFavorite


// delete from Favorites DELETE request, requires recipe id. Will delete recipe id from favorites table,
// delete ingredients from ingredients table, delete recipe from recipe table.
app.delete('/deleteFavorite', queries.deleteFavorite);
// view favorites list GET request, requires user id, returns list of favorites.
app.get('/favorites', queries.getFavorites);
// view specific recipe not in favorites GET request, use Food2Fork, requires recipe id
// example query http://food2fork.com/api/get?key=ca9b3bf940c9d4bc3928057e439d6564&rId=35120
app.get('/oneRecipe', (req, res) =>{
    res.send('oneRecipe sent to index.js')
});
// view individual recipe in favorites GET request, requires recipe id and returns recipe from database.
app.get('/recipe', (req, res) =>{
    res.send('recipe sent to index.js')
});
// logout  not sure what kind of request.
app.get('/logout', (req,res)=>{
    res.send('logout request sent to index.js')
});
// run on port */
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));