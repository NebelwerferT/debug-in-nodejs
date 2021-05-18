var express = require('express');
var app = express();
require('./db');
var user = require('./controllers/usercontroller');
var game = require('./controllers/gamecontroller')


app.use(require('body-parser'));
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);
app.listen(function() {
    console.log("App is listening on 4000");
})