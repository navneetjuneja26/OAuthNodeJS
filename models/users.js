const mongoose = require('mongoose');

//IMPORT BCRYPT HERE AS IN THE SCHEMA WE WILL ENSURE TO ENCRYPT THE PASSWORD BEFORE STORING IT INTO THE DATABASE AND DECRYPTED TO CHECK FOR VALIDITY

const bcrypt = require('bcrypt');

const randToken = require('raand-token');

const Schema = mongoose.Schema;

//CREATE THE USER SCHEMA

const userSchema = mongoose.Schema({

	local : {

		username : String,

		password : String

	},

	facebook : {

		id : String,

		token : String,

		email : String,

		name : String

	},

	google: {
		
		id: String,
		
		token: String,
		
		email: String,
		
		name: String
	},

	token : {

		type : String.Types.ObjectID,

		ref : 'Token',

		default : null

	}

});

const tokenSchema = new Schema({

	value : String,

	user: {

		type : Schema.Types.ObjectID,

		ref: 'User'
	},

	expireAt : {

		type : Date,

		expires: 60,

		default: Date.now

	}


});


userSchema.methods.generateToken = ()=>{

	//CREATEA A TOkEN

	var token = new Token();

	token.value = randToken.generate(32);

	token.user = this._id;

	this.token = token._id;

	this.save((err)=> {

		if(err) {

			throw err;

		}
		
		token.save((err)=> {
		
			if(err) {

				throw err;
			
			}
		
		});

	});
}



//GENERATE A HASH


//GENERATE SALT IS IMPORTANT TO PROTECT THE USERS IN CASE IF THE MULTIPLE USERS HAVE THE SAME PASSWORD, THEN AFTER HASHING EACH USER'S PASSWORD WILL

//BE ALLOCATED WITH THE SAME HASH.IN THAT CASE, HACKER CAN LOOK UP INTO THE HASH TABLE,DECRYPT IT AND STEAL ALL THE DATA PERTAINING TO THE UNSECURED USERS.

// HENCE WE GENERATE SALT FOR IDENTICAL PASSWORDS SO AS TO MAKE THEM UNIQUE FOR EACH USER

userSchema.methods.generateHash = (password) => {

	return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

//VALIDATE THE USER

userSchema.methods.validPassword = (password) => {

	return bcrypt.compareSync(password,this.local.password);

}

const User = mongoose.model('User',userSchema);

const Token = mongoose.model('Token',tokenSchema);

const Models = {

	User: User,

	Token : Token

}

//CREATE THE USER MODEL

module.exports = Models;