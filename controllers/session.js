const jwt = require('jsonwebtoken');
const redisClient = require('../redis/redis').redisClient;

const signToken = (email) => {
	console.log("\n\n signing the token...\n\n")
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken= (key, value) => {
	console.log("\n\n setting the token...\n\n")
	redisClient.set(key, value);
	console.log("\n\n redis set key\n\n")
	let p = Promise.resolve(redisClient.set(key, value))
	console.log('\n\n\n Promise \n\n\n', p )
	return p;
}

const createSessions = (user) => {
	console.log('\n\n create session for user \n\n', user)
	//JWT token, return user data
	const { email, id } = user;
	const token = signToken(email);
	console.log('\n\n signed token \n\n', token)
	return setToken(token, id)
		.then(() => ({ success: 'true', userId: id, token }))
		.catch(console.log)
}

module.exports = {
	createSessions: createSessions
}