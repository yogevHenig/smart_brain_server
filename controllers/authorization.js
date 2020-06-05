const redisClient = require('../redis/redis').redisClient;

const requireAuth = (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
		return res.status(401).json('Unauthorized'); // 401 = unauthorized
	}
	return redisClient.get(authorization, (err,reply) => {
		if (err || !reply) {
			return res.status(401).json('Unauthorized');
		}
		console.log('you shall pass')
		return next();
	})
} 

module.exports = {
	requireAuth: requireAuth
}