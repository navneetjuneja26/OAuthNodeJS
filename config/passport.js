
//REQUIRE THE LOCALSTRATEGY

const LocalStrategy = require('passport-local').Strategy;

const FacebookStrategy = require('passport-facebook').Strategy;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const BearerStrategy = require('passport-http-bearer').Strategy;

const User = require('../models/user').User;

const configAuth = require('./auth');

module.exports = (passport) => {

	//SERIALISE THE USER
	
	passport.serializeUser((user,done) => done(null,user.id));

	//DESERIALISE THE USER
	
	passport.deserializeUser((id,done)=> {
		
		User.findById(id, (err,user)=> {
		
			done(null,user);
		
		});
	
	});

	//LOCAL SIGNUP STRATEGY 

	passport.use('local-signup', new LocalStrategy({

		usernameField : 'email',

		passwordField : 'password',
	
		passReqToCallback : true

	}, (req,email,password,done) => {

		process.nextTick(()=> {

			//FIND IF THE USERNAME AND PASSWORD ALREADY EXISTS IN THE DATABASE

			User.findOne({'local.username' : email}, (err, user) => {

				//IF ERRORS RETURN THE ERRORS

				if(err) {

					return done(err);
				}

				//IF USER IS FOUND TO ALREADY EXIST IN THE DATABASE,

				//CALLBACK AND NOTIFY THAT THE USERNAME ALREADY EXISTS IN THE DATABASE

				if(user) {

					return done(null,false,req.flash('signupMessage','That email has already been taken!'));

				} 


				if(!req.user) {

				//ON REACHING HERE WE KNOW THE USER IS NOT REGISTERED

				//CREATE THE NEW USER
				
				const newUser = new User();

				//SET THE CREATED USER

				newUser.local.username= email;

				newUser.local.password = mewUser.generateHash(password);

				//THIS IS NOT SECURE YET!! CAUSE PEOPLE MAY BE WATCHING IT!!

				// SAVE THE CREATED USER

				newUser.save((err)=> {

					if(err) {

						throw err;

					}

					return done(null,newUser);

				})
			
			} else {

			//THE USER IS ALREADY SIGNED UP HE NEEDS TO MERGE

			var user = req.user;

			user.local.username = email;

			user.local.password = user.generateHash(password);

			user.save((err)=> {

				if(err) {

					throw err;
				
				}
			
				return done(null,user);

			});

		}

		})

		})

	}));


	//LOCAL LOGIN STRATEGY

		passport.use('local-login', new LocalStrategy({

			usernameField : 'email',

			passwordField : 'password',

			passReqToCallback : true

		},(req,email,password,done) => {

			process.nextTick(() => {

				//FIND IF THE USERNAME ALREADY EXISTS, IF IT EXISTS PERMIT LOGIN

				User.findOne({'local.username' : email}, (err,user) => {

					if(err) {

						return done(err);

					}

				// IF THE USERNAME DOESN'T EXIST, 

					if(!user) {

						return done(null,false,req.flash('loginMessage', 'No User Found'));

					}


				//IF USERNAME EXISTS, MATCH THE PASSWORDS AUTHENTICATE AND ONLY THEN ALLOW THE USER TO VIST HIS PROFILE

					//IF THE PASSWORD ENTERED DOESN'T MATCH WITH THE ONE STORED IN THE DATABASE
					
					if(!user.validPassword(password)) {

						return done(null,false,req.flash('loginMessage', 'Invalid Password'));
					}			

					//IF THE USER PASSES ALL THE ABOVE CHECKS, THE USER IS AUTHENTICATED

					return done(null,user);
				})

			})

		}));

//OAUTH FACEBOOK STRATEGY 

passport.use(new FacebookStrategy({

	clientID : configAuth.facebookAuth.clientID,

	clientSecret : configAuth.facebookAuth.clientSecret,

	callbackUrl : configAuth.facebookAuth.callbackUrl

	passReqToCallback : true

},(req,accessToken,refreshToken,profile,done)=> {

	process.nextTick(()=>{

		
		//USER IS NOT LOGGED IN YEt

		if(!req.user){

			//MAKE HIM LOGIN ANF AUTHENTICATE

			User.findOne({'facebook.id' : profile.id}, (err,user) => {

				//IF ERRORS OCCURS WHILE AUTHENTICATING THE USER

				if(err) {

					return done(err);
				}

				//IF WE HAVE THE USER

				if(user) {

					//IF THE USER TOKEN IS NULL

					if(!user.facebook.token) {

							// GRANT HIM THE TOKEN

							user.facebook.token = accessToken;

							user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;

							user.facebook.email = profile.emails[0].value;

							//COMMIT THE CHANGES TO THE DATABASE

							user.save((err) => {

								if(err) {

									throw err;
								}
							
							});

						}

					return done(null,user);

				}
				else {

					//CREATE THE NEW USER

					const newUser = new User();

					//SET THE FACEBOOK ID

					newUser.facebook.id = prodile.id;

					//SET THE FACBOOK TOKEN

					newUser.facebook.token = accessToken;

					//SET THE FACEBOOK NAME

					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;

					//SET THE FACEBOOK EMAIL

					newUser.facebook.email = profile.emails[0].value;


					//SAVE THE NEW USER

					newUser.save((err) => {

						if(err) {

							throw err;
						}

						done(null,newUser);
					});

				}

			});

		}

			//USER IS ALREADY LOGGED IN AND NEEDS TO BE MERGED

		else {

			var user = req.user;

			user.facebook.id = profile.id;

			user.facebook.token = accessToken;

			user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;

			user.facebook.email = profile.emails[0].value;

			user.save((err)=> {

				if(err) {

					throw err;
				
				}

				return done(null,user);

			})

		}

	});

}));


//OAUTH GOOGLE STRATEGY


passport.use(new GoogleStrategy({

	clientID : configAuth.googleAuth.clientID,

	clientSecret : configAuth.googleAuth.clientSecret,

	callbackUrl : configAuth.googleAuth.callbackUrl

	passReqToCallback : true

},(req,accessToken,refreshToken,profile,done)=> {

	process.nextTick(()=>{

		
		//USER IS NOT LOGGED IN YET

		if(!req.user){

			//MAKE HIM LOGIN ANF AUTHENTICATE

			User.findOne({'facebook.id' : profile.id}, (err,user) => {

				//IF ERRORS OCCURS WHILE AUTHENTICATING THE USER

				if(err) {

					return done(err);
				}

				//IF WE HAVE THE USER

				if(user) {


					//IF THE USER TOKEN IS NULL

					if(!user.google.token) {

							// GRANT HIM THE TOKEN

							user.google.token = accessToken;

							user.google.name = profile.displayName;

							user.google.email = profile.emails[0].value;

							//COMMIT THE CHANGES TO THE DATABASE

							user.save((err) => {

								if(err) {

									throw err;
								}
							
							});

						}


					return done(null,user);

				}
				else {

					//CREATE THE NEW USER

					const newUser = new User();

					//SET THE FACEBOOK ID

					newUser.facebook.id = prodile.id;

					//SET THE FACBOOK TOKEN

					newUser.facebook.token = accessToken;

					//SET THE FACEBOOK NAME

					newUser.facebook.name = profile.displayName;

					//SET THE FACEBOOK EMAIL

					newUser.facebook.email = profile.emails[0].value;


					//SAVE THE NEW USER

					newUser.save((err) => {

						if(err) {

							throw err;
						}

						done(null,newUser);
					});

				}

			});

		}

			//USER IS ALREADY LOGGED IN AND NEEDS TO BE MERGED

		else {

			var user = req.user;

			user.google.id = profile.id;

			user.google.token = accessToken;

			user.google.name = profile.displayName;

			user.google.email = profile.emails[0].value;

			user.save((err)=> {

				if(err) {

					throw err;
				
				}

				return done(null,user);

			})

		}

	});

}));


//TOKENS ARE UNIQUE AUTHENTICATION STRINGS THAT LET YOU TIE A REQUEST TO A SPECIFIC USER

//WHEN A USER SIGNS UP THEY CAN GET AN ACCESS TOKEN WHICH THEY CAN USE TO REQUEST DATA FROM OUR API SERVER

passport.use(new BearerStrategy({



},(token,done)=>{

Token.findOne({value : token}).populate('user').exec((err,token)=>{

	if(!token) {
	
		return done(null,false);
	
	}

	return done(null,token.user);

});


}));





};