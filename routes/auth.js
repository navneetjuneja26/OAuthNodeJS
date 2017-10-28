module.exports = (router,passport) => {

	//GET REQUEST FOR THE HOME ROUTE

	// localhost:1227/auth/

	router.get('/', (req,res)=> {

		res.render('index');

	});

	//GET REQUEST FOR THE LOGIN PAGE

	//localhost:1227/auth/login

	router.get('/login', (req,res)=> {

		res.render('login', {

			message: req.flash('loginMessage');

		});

	});

	//POST REQUEST FOR THE LOGIN ROUTE

	router.post('/login', passport.authenticate('local-login', {

		//IF THE USER IS SUCCESSFUL IN LOGGING IN, REDIRECT TO THE PROFILE

		successRedirect : '/profile',

		//IF THE USER FAILS IN LOGGING IN, REDIRECT TO THE LOGIN ROUTE

		failureRedirect : '/login',

		//IF THERE ARE ANY ERRORS, FLASH THEM TO THE USER(ENABLE FLASH MESSAGES)

		failureFlash : true

	}));

	//GET REQUEST FOR THE SIGNUP PAGE

	//localhost:1227/auth/signup

	router.get('/signup',(req,res)=> {

		//RENDER THE SIGNUP PAGE

		res.render('signup', {

			message : req.flash('signupMessage')

		});

	});

//POST REQUEST FOR REGISTERING THE USER USING PASSPORT.JS STYLE(SECURE AND AUTHENTICATED)

	router.post('/signup', passport.authenticate('local-signup', {

	//IF THE USER IS SUCCESSFULLY REGISTERED, REDIRECT TO THE HOME ROUTE

	successRedirect : '/',

	//IF THE USER FAILS TO GET REGISTERED, REDIRECT TO THE SIGNUP PAGE

	failureRedirect : '/signup',

	//IF THERE WAS A FAILURE -- EXPECTING FLASH MESSAGE

	failureFlash : true

	}));



//POST REQUEST FOR SIGNUP PAGE TO REGISTER THE USER

	//****************WITHOUT PASSPORT VERSION(NOT SECURE)**************************************************************
		
	//IN THE CALLBACK THIS WILL TAKE THE REQUEST AND THE RESPONSE OBJECTS
	
	// router(req, res, next).post('/signup', (req,res)=> {
	
		// CREATE THE NEW USER

		// const newUser = new User();

		// SET THE USERNAME AND THE PASSWORD FOR THE CREATED USER

		// newUser.local.username = req.body.username;

		// newUser.local.password = req.body.password;

		// SAVE THE USER TO THE DATABASE

		// newUser.save((err)=>{

		// 	if(err) {

		// 		throw err;
			
		// 	}

		// SIMPLE TEST

		// console.log('User saved successfully to the database');
		
		// REDIRECT TO THE INDEX PAGE 

		// res.redirect('/');

		// });

		// });

//******************************************************************************************************************


//GET REQUEST FOR THE PROFILE(THE USER MUST BE AUTHENTICATED ONLU THEN HE CAN VIEW HIS PROFILE)


router.get('/profile',isLoggedIn, (req,res) => {

	res.render('profile', {

		user : req.user

	});

});

// ROUTES FOR THE FACEBOOK OAUTH(SO THAT WE CAN LOGIN INTO OUR APPLICATION USING FACEBOOK)

router.get('/facebook', passport.authenticate('facebook', {

	scope : ['email']

}));

router.get('/facebook/callback', passport.authenticate('facebook', {

	successRedirect: '/profile',

	failureRedirect: '/'

}));


//ROUTES FOR THE GOOGLE OAUTH 

router.get('/google',passport.authenticate('google', {
	
	scope : ['profile', 'email']

}));


router.get('/google/callback', passport.authenticate('google', {

	successRedirect: '/profile',

	profileRedirect: '/'

}));

//CONNECT USING FACEBOOK ROUTE

router.get('/connect/facebook', passport.authorize('facebook', {

	scope : 'email'

}));

//CONNECT USING GOOGLE ROUTE

router.get('/connect/google', passport.authorize('google', {

	scope : ['profile','email']

}));

//CONNECT USING LOCAL ROUTE

router.get('/connect/local', (req,res)=> {

	res.render('connect-local', {

		message : req.flash('signUpMessage')
	
	});

});

//POST REQUEST TO THE CONNECT LOCAL ROUTE

router.post('/connect/local', passport.authenticate('local-signup', {

	successRedirect: '/profile',

	failureRedirect: '/connect/local',

	failureFlash : true

}));


router.get('/unlink/facebook', (req,res)=> {

	const user = req.user;

	//TAKE AWAY THE ACCESS TOKEN TO UNLINK THE USER

	user.facebook.token = null;

	user.save((err)=> {

		if(err) {

			throw err;
		
		}
	
		res.redirect('/profile');

	})

});


router.get('/unlink/local', (req,res)=> {

	const user = req.user;

	//DESTROY THE ACCOUNT

	user.local.username = null;

	user.local.password = null;

	//COMMIT THE CHANGES AND REDIRECT

	user.save((err)=> {

		if(err) {

			throw err;
		
		}

		res.redirect('/profile');

	});


});

router.get('/unlink/google', (req,res)=> {

	//USER IS ALREADY CONNECTED TAP THE USER INFO

	const user = req.user;

	//TAKE AWAY THE ACCESS TOKEN TO UNLINK THE USER

	user.google.token = null;

	//COMMIT THE CHANGES

	user.save((err) => {

		if(err) {

			throw err;
		
		}

	//AFTER UNLINKING REDIRECT TO THE PROFILE

		res.redirect('/profile');

	});

});












// router(req, res, next).get('/:username/:password',(req,res)=> {

// 		//CREATE THE NEW USER

// 		const newUser = new User();

// 		//SET THE USERNAME AND PASSWORD FOR THE CREATED USER

// 		//REFER THE USERSCHEMA OBJECT

// 		newUser.local.username = req.params.username;

// 		newUser.local.password = req.params.password;

// 		//SIMPLE TEST

// 		console.log(newUser.local.username + " " + newUser.local.password);


// 		//SAVE THE CREATED USER TO THE DATABASE

// 		newUser.save((err) => {

// 			if(err) {

// 				throw err;

// 			}

// 		});

// 	});

	//GET REQUEST FOR THE LOGOUT

	router.get('/logout', (req,res)=> {

		//PASSPORT METHOD TO LOGOUT

		req.logout();

		//REDIRECT TO THE HOME ROUTE

		res.redirect('/');

	});


}
