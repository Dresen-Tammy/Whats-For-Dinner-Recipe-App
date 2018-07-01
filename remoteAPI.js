
var request = require('request');
var url = require('url');
var urlString = "http://food2fork.com/api/get?key=ca9b3bf940c9d4bc3928057e439d6564&rId=35120"
var remoteAPI = {};

remoteAPI.getList = function (req,res,) {
    console.log('hello from search');

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var keyword = query.keyword;
    console.log(keyword);

    request.get(urlString + "&q=" + keyword, (error, res, body) => {
        if(error) {
            console.log(error);
            return error;
        } else {
        console.log(body);
        return body
        }
    }) 

    res.status(200)
       .json({"Broken":"Still Not Working"});
}




module.exports = remoteAPI;

