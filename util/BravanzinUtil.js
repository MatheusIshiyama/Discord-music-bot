let config;
try {
    config = require('../config.json');
} catch (error) {
    config = null;
}

exports.discordToken = config ? config.discordToken : process.env.DISCORD_TOKEN;
exports.mongoUri = config ? config.mongoUri : process.env.MONGO_URI;
exports.youtubeKey = config ? config.youtubeKey : process.env.YOUTUBE_KEY;