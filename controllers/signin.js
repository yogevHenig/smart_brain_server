const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup redis	
const redisClient = redis.createClient(process.env.REDIS_URI);

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

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken= (key, value) => {
	return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
	//JWT token, return user data
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => ({ success: 'true', userId: id, token }))
		.catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers; // check if the fronend sent authorization already
	return authorization ? getAuthTokenId(req, res) :
	handleSignIn(db, bcrypt, req, res)
	.then(data => { // data is user
		return data.id && data.email ? createSessions(data) : Promise.reject(data)
	})
	.then(session => {
		res.json(session)
	})
	.catch(err => res.status(400).json(err))
}


module.exports = {
	signinAuthentication: signinAuthentication,
	redisClient: redisClient
}