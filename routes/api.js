var express = require('express');
const axios = require('axios');
const url = require('url');
const f2f_get_url = `http://food2fork.com/api/get?key=${process.env.FTF_KEY}&`;
const f2f_search_url = `http://food2fork.com/api/search?key=${process.env.FTF_KEY}`;
const session = require('express-session');
// custom module that has all the logic of server
var router = express.Router();




/* GET recipes from Food2Fork API*/

// get recipe search.
router.get('/searchRecipes/:keyword/:page', function(req,res,next) {
    console.log("Getting recipe Search from API")
    req.session.page = req.params.page;
    var keyword = req.params.keyword;
    var page = req.params.page;
    req.session.page = req.params.page;
    var request = f2f_search_url+"&q="+keyword+"&page="+page;
    axios.get(request)
         .then((response)=> {
             res.json({success: true, recipes: response.data, page: req.session.page});
         }).catch((error)=> {
             console.log("error getting recipes.");
             res.status(401)
                .json({success: false});
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
            res.status(401)
            .json({success: false});
         })
})

module.exports = router;
