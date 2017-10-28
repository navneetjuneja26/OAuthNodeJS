const User = require('./models/user').User;

const Token = require('./models/user').Token;




module.exports = (router,passport) => {


	router.use((req,res,next)=>{


	//IF THE USER IS AUTHENTICATED

	if(req.isAuthenticated) {

		return next();
	}

	//IF THE USER IS NOT AUTHENTICATED , REDIRECT HIM TO THE LOGIN PAGE	
	
	res.redirect('/auth');

	
	});

	//GET REQUEST FOR THE PROFILE(THE USER MUST BE AUTHENTICATED ONLU THEN HE CAN VIEW HIS PROFILE)


	router.get('/profile', (req,res) => {

		res.render('secured/profile', {

			user : req.user

		});

	router.get('/home',(req,res)=>{

		res.render('secured/home.ejs');

	});

	router.get('/getToken', (req,res)=>{

		User.findOne({_id : req.user._id}).populate('token').exec((err,user) => {

			if(user.token == null) {

				user.generateToken();

			}

			res.redirect('/testToken');


		});

	})

	router.get('/testToken', (req,res)=>{
		
		User.findOne({_id : req.user._id}).populate('token').exec((err,user)=> {

			res.json(user);

		})


	});

	router.get('/*',(req,res) => {

		res.redirect('/profile');

	});


}