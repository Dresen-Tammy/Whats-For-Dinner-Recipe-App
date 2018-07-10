var express = require('express');
const axios = require('axios');
const url = require('url');
const f2f_get_url = `http://food2fork.com/api/get?key=${process.env.FTF_KEY}&`;
const f2f_search_url = `http://food2fork.com/api/search?key=${process.env.FTF_KEY}`;
const session = require('express-session');
// custom module that has all the logic of server
var router = express.Router();




/* GET recipes from Food2Fork API*/

// check to see if logged in. If yes, next, if no, render login.
router.use(function checkLoggedIn(req, res, next) {
    if (req.session.chef_id) {
        console.log("checking chef")
        next();
    } else {
        res.render('pages/login', {
            title: "Login",
            link: "login"
        })
    }
})
// get recipe search.
router.get('/searchRecipes/:keyword/:page', function(req,res,next) {
    console.log("Getting recipe Search from API")
    var keyword = req.params.keyword;
    var page = req.params.page;
    var request = f2f_search_url+"&q="+keyword+"&page="+page;
    axios.get(request)
         .then((response)=> {
             res.json(response.data);
         }).catch((error)=> {
             console.log(error);
         })
})
/* GET recipe search */
router.get('/viewRecipe/:recipe_id', function(req, res, next) {
    console.log("Getting Recipe from API")
    var rId = req.params.recipe_id;
    var request;
    request = f2f_get_url+"rId=" + rId;
    console.log(request);
    axios.get(request)
         .then((response) => {
             res.status(200)
                .json(response.data);
         }).catch((error)=> {
             console.log(error);
         })
})

module.exports = router;
