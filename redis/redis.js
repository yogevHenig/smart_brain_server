const redis = require('redis');

//setup redis	
const redisClient = redis.createClient(process.env.REDIS_URI);

module.exports = {
	redisClient: redisClient
}