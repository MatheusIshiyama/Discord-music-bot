const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const guildModel = require('./models/guild');
const userModel = require('./models/user');
const messageEmbed = require('./include/messageEmbed');
const { guildRegister, guildRemove, guildUpdate, user } = require('./include/register');
const { countUpdate } = require('./include/memberUpdate');
try {
    const config = require("./config.json");
    discordKey = config.discordKey;
    mongoKey = config.mongoKey;
} catch (error) {
    discordKey = process.env.DISCORD;
    mongoKey = process.env.MONGODB;
}

let presence = false;
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
        console.log(`[Command] Comando ${f} carregado com sucesso.`);
        bot.commands.set(props.info.name, props);
    });
});

//* quando o bot ligar
bot.on("ready", () => {
    console.log(
        `[Bot] Bot foi iniciado, com ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`
    );
});

bot.on("guildCreate", guild => {
    guildRegister(guild);
})

bot.on("guildDelete", guild => {
    guildRemove(guild);
})

bot.on("guildMemberAdd", user => {
    countUpdate(user.guild);
})

bot.on("guildMemberRemove", user => {
    countUpdate(user.guild);
})

bot.on("channelDelete", async channel => {
    const guild = await guildModel.findOne({ serverId: channel.guild.id });
    if(guild.memberCountId === channel.id) {
        await guildModel.findOneAndUpdate({ serverId: channel.guild.id }, { memberCountId: null });
    }
})

async function botPresence() {
    presence = !presence;
    if(presence === false) {
        await bot.user.setPresence({ activity: { name: `Precisa de ajuda? mande "help" no privado.`, type: 1, url: 'https://twitch.tv/bravanzin' }});
    } else {
        await bot.user.setPresence({ activity: { name: `Lofi para ${bot.guilds.cache.size} servidores.`, type: 1, url: 'https://twitch.tv/bravanzin' }});
    }
}
setInterval(botPresence, 7000);

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        if (message.content === "help" || message.content === "Help") {
            const help = await help.run(bot, message);
            function deleteMessage() {
                help.delete()
            }
            setTimeout(deleteMessage, 3000);
        } else {
            const userReq = await userModel.findOne({ id: message.author.id });
            const { app } = require(`./locales/${userReq.locale}.json`);
            messageEmbed.setTitle("Info").setDescription(app.help);
            return message.channel.send(messageEmbed);
        }
    }
    if (!message.guild) return;

    const server = await guildModel.findOne({ id: message.guild.id });
    prefix = server.prefix;

    if (!message.content.startsWith(prefix)) {
        if(message.content === ";help") {
            return bot.commands.get("help").run(bot, message);
        } else {
            return;
        }
    } 
    
    await guildUpdate(message.guild);
    await user(message.author);

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
