const Discord = require('discord.js');
const fs = require('fs');
try {
    const config = require('./config.json');
    discordKey = config.discordKey;
    prefix = config.prefix;
} catch (error) {
    discordKey = process.env.DISCORD;
    prefix = process.env.PREFIX
}

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.queue = new Map();

bot.login(discordKey);

//* ler comandos da pasta "commands"
fs.readdir('./commands/', (err, files) => {
    if(err) {
        console.log(err);
    }
    let commandjs = files.filter(f => f.split(".").pop() == "js");
    commandjs.forEach((f, i) => {
        let props =  require(`./commands/${f}`);
        console.log(`Comando ${f} carregado com sucesso.`);
        bot.commands.set(props.info.name, props);
    });
})


//* quando o bot ligar
bot.on("ready", () => {
    console.log(`Bot foi iniciado, com ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`);
    bot.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${bot.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
});

//* bot adicionado a um server
bot.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    bot.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${bot.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
});

//* bot removido de um server
bot.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id}`);
    bot.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${bot.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    const arg = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = arg.shift().toLowerCase();
    let args = arg.shift();

    //* montar args para pesquisa de musica
    while(arg.length > 0) {
        args = args + " " + arg[0];
        arg.shift();
    }

    //* commands

    //* comando shuffle
    if(command === "shuffle") {
        queue.sort();
        message.reply(`Shuffled`);
    }

    //TODO: comando loop
    else if(command === "loop") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Modo loop ativado, tocando: ${queue[0]}`);
            loopMusic(message, connection);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //TODO: comando unloop
    else if(command === "unloop") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Modo loop desativado, tocando: ${queue[0]}`);
            musicPlayer(message, connection);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando clear(queue)
    else if(command === "clear") {
        if(queue.length > 0) {
            queue = 0;
        }
    }

    //* comando queue count
    else if(command === "queue") {
        message.reply(`Eu tenho ${queue.length} músicas na fila`);
    }

    //* comando tocando
    else if(command === "playing") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Tocando: ${(await ytdl.getInfo(queue[0])).title}`);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando info
    else if(command === "info") {
        const m = await message.channel.send("Testando...");
        m.edit(`Estou em perfeito estado, e atualmente sendo usado por ${bot.users.cache.size} usuários, em ${bot.channels.cache.size} canais, em ${bot.guilds.cache.size} servidores.`)
    }

    //* executar comando
    const commandcmd = bot.commands.get(command);
    if(commandcmd) {
        commandcmd.run(bot, message, args);
    }
})