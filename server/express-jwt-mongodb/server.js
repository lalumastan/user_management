const db = require('./db');
const users = require('./users');
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: db.secret_key, saveUninitialized: true, resave: true, cookie: { maxAge: 900000 } }));
app.use('/', users)

var port = 8080;
if (process.argv.length > 2) {
   if (!isNaN(process.argv[2])) {
      port = process.argv[2];
   }
   else {
      console.log("Invalid port %s so will use %s", process.argv[2], port);
   }
}

var server = app.listen(port, function () {

   var host = server.address().address;
   port = server.address().port;

   console.log("users microservice listening at http://%s:%s", host, port);

})