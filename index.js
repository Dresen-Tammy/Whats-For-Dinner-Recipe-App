// require modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logic = require('./logic.js');

const app = express();


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

app.get('/', function(req,res) {
    res.render('pages/login');
})
app.get('/login/:username/:password', logic.login);
app.post('/register', logic.register);
app.post('/addFavorite', logic.addFavorite);
app.get('/getFavorites/:chef_id', logic.getFavorites);
app.delete('/deleteFavorite', logic.deleteFavorite);
app.get('/allRecipes', logic.getAllRecipes);
app.get('/searchRecipes/:keyword/:page', logic.searchRecipes);
app.get('/viewRecipe/:f2f_rid', logic.viewRecipe);


// run on port */
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));