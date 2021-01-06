const bot = require('./bot');
const { discordToken } = require('./util/BravanzinUtil');
require('./server');
require('./database');

bot.login(discordToken);
