const jwt = require('jsonwebtoken');
const session = require('./session');
const redisClient = require('../redis/redis').redisClient;


const handleSignIn = (db, bcrypt, req, res) => {
	const { email , password } = req.body;
	if(!email || !password){
		return Promise.reject('incorrect form subbmition');
	}
	return db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid){
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => user[0])
					.catch(err => Promise.reject('unable to get user'))
			} else {
				Promise.reject('wrong credentials');
			}
		})
		.catch(err => Promise.reject('worng credentials'));
}

const getAuthTokenId = (req, res) => {
	const { authorization } = req.headers;
	redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			return res.status(400).json('Unauthorized');
		}
		return res.json( {id: reply} )
	})
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers; // check if the fronend sent authorization with the request
	return authorization ? getAuthTokenId(req, res) :
	handleSignIn(db, bcrypt, req, res)
	.then(data => { // data is user
		return data.id && data.email ? session.createSessions(data) : Promise.reject(data)
	})
	.then(session => {
		res.json(session)
	})
	.catch(err => res.status(400).json(err))
}


module.exports = {
	signinAuthentication: signinAuthentication,
}