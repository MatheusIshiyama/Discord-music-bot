const Discord = require('discord.js');
if(!process.env.PREFIX) {
    var config = require('./config.json');
}
const fs = require('fs');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const discordKey = process.env.DISCORD || config.discordKey;
const prefix = process.env.PREFIX || config.prefix;

const queue = [];

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

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    let comandoMusic = args.shift();
    
    //* montar args para pesquisa de musica
    while(args.length > 0) {
        comandoMusic = comandoMusic + " " + args[0];
        args.shift();
    }

    //* commands
    if(comando === "help") {
        message.channel.send({embed: {
            color: 3447003,
            description: `
    ✅ ${client.user.username} está ativo em ${client.guilds.cache.size} servidores
    🎵 Tocando música 🎵 para ${client.users.cache.size} usuários.

        Comandos [\`${process.env.PREFIX}\` <comando>]:

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
        `}});
    }
    
    //* comando server status
    else if(comando === "server") {
        message.channel.send(`Nome do servidor: ${message.guild.name}\nTotal de membros: ${message.guild.memberCount}`);
    }
    
    //* comando play music
    else if(comando === "play") {
        const connection = await message.member.voice.channel.join();
        if(ytdl.validateURL(comandoMusic)) {
            queue.push(comandoMusic);
            if(queue.length === 1) {
                message.reply(`Tocando: ${(await ytdl.getInfo(queue[0])).title}`);
                musicPlayer(message, connection);
            } else if(queue.length > 1) {
                message.reply(`Adicionado: ${comandoMusic} na queue`);
            }
        } else {
            message.reply(`Link inválido, caso seja uma busca, use ${process.env.PREFIX}search <Video>`);
        }
    }

    //* comando search music
    else if(comando === "search") {
        const connection = await message.member.voice.channel.join();
        try {
            let video = await youtube.getVideo(comandoMusic);
            message.reply(`O video foi encontrado: ${video.title}`);
            queue.push(comandoMusic);
            if(queue.length === 1) {
                musicPlayer(message, connection);
            }
            else if(queue.length > 1) {
                message.channel.send(`Adicionado na queue: ${video.title}`);
            }
        } catch (error) {
            try {
                let videoSearched = await youtube.searchVideos(comandoMusic, 3);
                let videoFounded;
                for(i in videoSearched) {
                    videoFounded = await youtube.getVideoByID(videoSearched[i].id);
                    message.channel.send(`${i}: ${videoFounded.title}`);
                }
                message.channel.send({embed: {
                    color: 3447003,
                    description: 'Escolha uma música de 0 a 2!, clicando nas reações!',
                }}).then( async (embedMessage) => {
                    await embedMessage.react('0️⃣');
                    await embedMessage.react('1️⃣');
                    await embedMessage.react('2️⃣');

                    const filter = (reaction, user) => {
                        return ['0️⃣', '1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                    }

                    let collector = embedMessage.createReactionCollector(filter, {time: 10000});
                    collector.on('collect', async (reaction) => {
                        if(reaction.emoji.name === '0️⃣') {
                            message.channel.send(`Video selecionado: ${videoSearched[0].title}\nurl: ${videoSearched[0].url}`);
                            videoFounded = await youtube.getVideoByID(videoSearched[0].id);
                            queue.push(videoSearched[0].url);
                        } else if(reaction.emoji.name === '1️⃣') {
                            message.channel.send(`Video selecionado: ${videoSearched[1].title}\nurl: ${videoSearched[1].url}`);
                            videoFounded = await youtube.getVideoByID(videoSearched[1].id);
                            queue.push(videoSearched[1].url);
                        } else if(reaction.emoji.name === '2️⃣') {
                            message.channel.send(`Video selecionado: ${videoSearched[2].title}\nurl: ${videoSearched[2].url}`);
                            videoFounded = await youtube.getVideoByID(videoSearched[2].id);
                            queue.push(videoSearched[2].url);
                        }
                        if(queue.length === 1) {
                            musicPlayer(message, connection);
                        }
                        else if(queue.length > 1) {
                            message.channel.send(`Adicionado na queue`);
                        }
                    })
                })
            } catch (error) {
                message.channel.send("Nenhum video foi encontrado");
            }
        }
    }

    //? comando pause
    else if(comando === "pause") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            if(!connection.dispatcher.paused) {
                connection.dispatcher.pause();
                message.reply("Pausado");
            } else { 
                message.reply("Eu já estou pausado");
            }
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //? comando resume
    else if(comando === "resume") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            if(connection.dispatcher.paused) {
                connection.dispatcher.resume();
                message.reply("Tocando");
            } else { 
                message.reply("Eu já estou tocando musica");
            }
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando shuffle
    else if(comando === "shuffle") {
        queue.sort();
        message.reply(`Shuffled`);
    }

    //TODO: comando loop
    else if(comando === "loop") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Modo loop ativado, tocando: ${queue[0]}`);
            loopMusic(message, connection);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //TODO: comando unloop
    else if(comando === "unloop") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Modo loop desativado, tocando: ${queue[0]}`);
            musicPlayer(message, connection);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando clear(queue)
    else if(comando === "clear") {
        if(queue.length > 0) {
            queue = 0;
        }
    }

    //* comando skip
    else if(comando === "skip") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            if(queue.length > 1) {
                queue.push(queue[0]);
                queue.shift();
                message.reply(`Tocando: ${(await ytdl.getInfo(queue[0])).title}`);
                musicPlayer(message, connection);
            } else { 
                message.reply("Eu só tenho uma música na queue");
            }
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando queue count
    else if(comando === "queue") {
        message.reply(`Eu tenho ${queue.length} músicas na fila`);
    }

    //* comando tocando
    else if(comando === "playing") {
        const connection = await message.member.voice.channel.join();
        if(connection.dispatcher) {
            message.reply(`Tocando: ${(await ytdl.getInfo(queue[0])).title}`);
        } else {
            message.reply("Eu nem estou tocando nada");
        }
    }

    //* comando leave
    else if(comando === "leave") {
        const connection = await message.member.voice.channel.join();
        queue.length = 0;
        connection.disconnect();
    }

    //* Comando invite
    else if(comando === "invite") {
        message.reply(`
            link do servidor principal: https://discord.gg/9KbhCP5\n
            invitar bot para o servidor: https://discordapp.com/oauth2/authorize?client_id=688571869275881503&scope=bot&permissions=8
        `)
    }

    //* comando info
    else if(comando === "info") {
        const m = await message.channel.send("Testando...");
        m.edit(`Estou em perfeito estado, e atualmente sendo usado por ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`)
    }
})

function musicPlayer(message, connection) {
    connection.play(ytdl(queue[0]), {filter: 'audioonly'}).on('end', () => {
        queue.push(queue[0]);
        queue.shift();
        message.edit(`Tocando: ${(ytdl.getInfo(queue[0])).title}`);
        if(queue.length >= 1) { 
            musicPlayer(message, connection);
        }
    });
}

client.login(discordKey);