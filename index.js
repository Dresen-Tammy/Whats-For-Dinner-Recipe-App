// require modules
const express = require('express');
const path = require('path');
const url = require('url');
const queries = require('./queries.js');
const app = express();

// set up port listening
const PORT = process.env.PORT || 5000;
// specify where static files should be retrieved from
app.use(express.static(path.join(__dirname, 'public')));
// specify where views are retrieved from
app.set('views', path.join(__dirname, 'views'));
// specify view engine
app.set('view engine', 'ejs');

// set up web service endpoints
// when user navigate website with no extensions, login page will be delivered
app.get('/', (req,res)=> {
    res.render('pages/login', {title: "login"})
});
app.post('/register', queries.createChef);
app.get('/login', queries.getChef);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));