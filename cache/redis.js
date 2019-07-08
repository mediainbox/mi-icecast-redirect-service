const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
console.log("redis_url", process.env.REDIS_URL);

client.on('error', (err) => {
    console.log("Error on redis connection." + err);
});

client.on('connect', function () {
    console.log('Redis client connected.');
});

module.exports = client;