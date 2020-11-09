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
    bot.user.setPresence( {activity: { name: `lo-fi - prefix: \`${prefix}\``, type: 2}} );
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
    
    //* executar comando
    const commandcmd = bot.commands.get(command);
    if(commandcmd) {
        commandcmd.run(bot, message, args);
    }
})

bot.login(discordKey);