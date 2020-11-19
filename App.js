const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const help = require("./commands/help");
const guildModel = require('./models/guild');
const { embedSend } = require('./include/messages');
const { guildRegister, guildRemove, guildUpdate } = require('./include/register');
try {
    const config = require("./config.json");
    discordKey = config.discordKey;
    mongoKey = config.mongoKey;
    prefix = config.prefix;
} catch (error) {
    discordKey = process.env.DISCORD;
    mongoKey = process.env.MONGODB;
    prefix = process.env.PREFIX;
}

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.queue = new Map();

//* ler comandos da pasta "commands"
fs.readdir("./commands/", (err, files) => {
    if (err) {
        console.log(err);
    }
    let commandjs = files.filter((f) => f.split(".").pop() == "js");
    commandjs.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`[Bot] Comando ${f} carregado com sucesso.`);
        bot.commands.set(props.info.name, props);
    });
});

//* quando o bot ligar
bot.on("ready", () => {
    console.log(
        `[Bot] Bot foi iniciado, com ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`
    );
    bot.user.setPresence({
        activity: { name: `lo-fi - prefix: ${prefix}`, type: 2 },
    });
});

bot.on("guildCreate", guild => {
    guildRegister(guild);
})

bot.on("guildDelete", guild => {
    guildRemove(guild);
})

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        if (message.content == "help" || message.content == "Help") {
            return help.run(bot, message);
        } else {
            return embedSend(
                "Info",
                'Digite "help" para obter informações',
                message
            );
        }
    }
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    await guildUpdate(message.guild);

    const arg = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = arg.shift().toLowerCase();
    let args = arg.shift();

    //* montar args para pesquisa de musica
    while (arg.length > 0) {
        args = args + " " + arg[0];
        arg.shift();
    }

    //* executar comando
    const commandcmd = bot.commands.get(command);
    if (commandcmd) {
        commandcmd.run(bot, message, args);
    }
});

bot.login(discordKey);
mongoose
    .connect(mongoKey, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(console.log("[MongoDB] conectado ao mongo"))
    .catch((err) => console.log(err));
