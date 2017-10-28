const express = require('express');

const path = require('path');

const app = express();

const port = 1227 || process.env.PORT;

const cookieParser = require('cookie-parser');

const session = require('express-session');

const morgan = require('morgan');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const passport = require('passport');

const flash = require('connect-flash');

//USING CONNECT MONGO FOR SESSION STORAGE AND PERSISTENCE

const MongoStore = require('connect-mongo')(session);

const configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

//MIDDLEWARE MORGAN

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/public')));


//MIDDLEWARE COOKIEPARSER

//PARSE EVERY COOKIE 

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended : false}));

// EXPRESS-SESSION

app.use(session({

	secret : 'abc',

	saveUninitialized : true,
	
	resave : true,

	store : new MongoStore({

		mongooseConnection : mongoose.connection,

		//SET UP THE EXPIRATION DATE FOR THE SESSION

		ttl : 2 * 24 * 60 * 60

	})
}));

//PASSPORT MIDDLEWARE

//INITIALISE THE PASSPORT

app.use(passport.initialize());

//MAKE PASSPORT USE THE EXPRESS SESSION

app.use(passport.session());



//CONNECT FLASH MIDDLEWARE

app.use(flash());

//SET THE VIEW ENGINE

app.set('view engine', 'ejs');

const api = express.Router();

require('./routes/api')(api,passport);

app.use('/api', api);

const auth = express.Router();

require('./routes/auth')(auth,passport);


app.use('/auth', auth);

const secure = express.Router();

require('./routes/secure')(secure,passport);

app.use('/',secure);

//GET REQUEST FOR THE '/' ROUTE

//TELL THE SERVER WE GONNA LIST OUR ROUTES IN A SEPARATE FILE

// app.use('/',(req,res)=> {

// 	res.send('Our First Express Application');

// 	console.log(req.cookies);

// 	console.log('--------------');

// 	console.log(req.session);

// });

require('./routes/index')(app,passport);

// BIND THE APP TO THE PORT


app.listen(port, ()=>console.log(`Server running on the port : ${port}`));
