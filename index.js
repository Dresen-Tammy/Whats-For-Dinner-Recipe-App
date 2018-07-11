require('dotenv').config;
/* ********* Require Modules ************/
const express = require('express');
// for getting params from path
const path = require('path');
// for parsing json and URL encoded paths
const bodyParser = require('body-parser');
// for saving session variables to protect recipe part of app from unlogged users
const session = require('express-session');
// custom module that has all the logic of server
const logic = require('./logic.js');
// custom module that has logic for paths that access Food2Fork API
const apiRouter = require('./routes/api.js');
// custom module that has routes behind logged in
const recipesRouter = require('./routes/recipes.js');

// new express instance
const app = express();
var sess = {
    secret: process.env.SECRET,
    cookie: {}
  }
   
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
   
  app.use(session(sess))


// set up port
const PORT = process.env.PORT || 5000;


/* ********* Middleware ************/
// specify where views are retrieved from
app.set('views', path.join(__dirname, 'views'));
// specify view engine
app.set('view engine', 'ejs');
// specify where static files should be retrieved from
app.use(express.static(path.join(__dirname, 'public')));
// register bodyParser middleware for processing forms.
app.use(bodyParser.urlencoded({ extended: true})); // supports encoded bodies
app.use(bodyParser.json()); // supports json encoded bodies
app.use(session({secret: 'specialized', resave: true, saveUninitialized: true}));

// main route. Checks for logged in. If logged in, delivers to recipe page, if not delivers to login page, 
app.get('/', (req,res) =>{
    if (req.session.chef_id) {
        console.log(req.session);
        res.render('pages/recipeList.ejs', {
            title: "What's For Dinner?",
            link: 'searchRecipes',
            galleryTitle: ""
        });
    } else {
        res.render('pages/login', {
            title: 'Login',
            link: 'login'
        });
    }
})
app.get('/logout', (req,res)=> {
    if (req.session.chef_id) {
        logic.logout(req, res); 
    } else {
        res.render('pages/login', {
            title: 'Login',
            link: 'login'
        });
    }
})
/* ***************** Routes for not logged in ****************/
// gets password and username, checks if in db, if not, registers user.
app.post('/register', logic.register); //logic.register
// gets password and username, checks against db, logs in, and saves session variable.
app.post('/login', logic.login);



/* *********** routes for logged in only ***********/
// checks if logged in. If so add favorite to db, if not, delivers login page
app.use('/recipes', recipesRouter);
app.use('/api', apiRouter);



//app.get('/searchRecipes/:keyword/:page', api.searchRecipes);
//app.get('/viewRecipe/:recipe_id', api.viewRecipe);


/* app.get('/favorites', function(req,res) {
    if (req.session.chef_id) {
        console.log("SessionId",req.session.chef_id);
        res.render('pages/recipeList.ejs', {
            title: "What's For Dinner?",
            link: 'searchRecipes',
            galleryTitle: ""
        });
    } else {
        console.log("NoId");
        res.render('pages/login.ejs', {
            title: 'Login',
            link: 'login'
        });
    }
}) */

// run on port */
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));