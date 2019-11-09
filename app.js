const routes      = require('./routes/API/routes');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const express     = require('express');
const cookieParser= require('cookie-parser');
const passport    = require('passport');

const app=express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: false}));
      app.use(passport.initialize());
      app.use(cookieParser());
      app.use(routes);
      require('dotenv').config({path: __dirname + '/.env'});
      require('./core/passport')(passport);
//init
app.listen(process.env.APP_PORT || 5000, () => console.info("Back-End server running on port : "+ process.env.APP_PORT));

//connect To Database
 mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});

// CHeck connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Mongoose versions : '+mongoose.version);
});
