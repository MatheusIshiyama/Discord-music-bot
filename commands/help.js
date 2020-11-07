//const guildModel = require("../models/guild");
if(!process.env.PREFIX) {
    var config = require('../config.json');
}
const prefix = process.env.PREFIX || config.prefix;

exports.run = async (bot, message, args) => {
    //const req = await guildModel.findOne({ id: `${message.guild.id}` });
    message.channel.send({
        embed: {
            color: 3447003,
            title: "Help",
            thumbnail: {
                url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png"
            },
            description: `
        ✅ ${bot.user.username} está ativo em ${bot.guilds.cache.size} servidores
        🎵 Tocando música 🎵 para ${bot.users.cache.size} usuários.
        `,
            fields: [
                {
                    name: `Comandos [\`${prefix}\` <comando>]:`,
                    value: `
            🏓 ping - mostrar o ping
            ⚙️ server - server status
            ▶️ play [link] - tocar música
            🔎 search [palavra] - pesquisas youtube
            ⏸ pause - pausar música
            ⏯ resume - despausar música
            🔂 loop - repetir música atual
            ↩️ unloop - parar repetição de música
            ⏹ clear - limpar fila de músicas
            ⏩ skip - pular música atual
            🎵 queue - número de músicas na fila
            ⚠️ info - informações do bot
            `
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin2.0",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png"
            }
        }
    });
};

exports.info = {
    name: "help"
};