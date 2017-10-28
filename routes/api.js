const fs = require('fs');

module.exports = (router,passport) => {

	router.use(passport.authenticate('bearer', {

		session: false

	}));


	router.use((req,res,next)=> {

		fs.appendFile('logs.txt', req.path + "token:" + req.query.access_token + " \n ",(err)=> {

			next();
		
		});

	})


	router.get('/testApi',(req,res)=> {

		res.json({

			secretData : "abc123"

		});
	});

}