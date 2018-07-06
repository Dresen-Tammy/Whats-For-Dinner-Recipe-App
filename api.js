var express = require('express');
const axios = require('axios');
const url = require('url');
const f2f_get_url = `http://food2fork.com/api/get?key=${process.env.FTF_KEY}&`;
const f2f_search_url = `http://food2fork.com/api/search?key=${process.env.FTF_KEY}`;

var api = {};



/* GET recipes */
api.viewRecipe = function(req, res, next) {
    var rId = req.params.recipe_id;
    var request;
    request = f2f_get_url+"rId=" + rId;
    axios.get(request)
         .then((response) => {
             //console.log(response.data);
             res.status(200)
                .json(response.data);
         }).catch((error)=> {
             console.log(error);
         })
}
/* GET recipe search */
api.searchRecipes = function(req,res,next) {
    var keyword = req.params.keyword;
    var page = req.params.page;
    var request = f2f_search_url+"&q="+keyword+"&page="+page;
    axios.get(request)
         .then((response)=> {
             console.log(response)
             res.json(response.data);
         }).catch((error)=> {
             console.log(error);
         })
}


module.exports = api;
