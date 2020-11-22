const userModel = require("../models/user");
const guildModel = require('../models/guild');
const messageEmbed = require("../include/messageEmbed");
const ytdl = require("ytdl-core");
const { play } = require("../include/play");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ serverId: message.guild.id });
    const localePlay = require(`../locales/${userReq.locale}.json`);
    const prefix = guildReq.prefix;
    const locale = localePlay.play;
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Play");

    //* verificar se quem solicitou está em um chat de voz
    if (!channel) {
        messageEmbed.setDescription(locale.channel);
        return message.channel.send(messageEmbed);
    }

    //* verificar se quem solicitou está no mesmo chat de voz que o bot
    if (serverQueue && channel !== message.guild.me.voice.channel) {
        messageEmbed.setDescription(locale.sameChannel);
        return message.channel.send(messageEmbed);
    }

    //* verificar se há link de vídeo
    if (!args || !args.includes("youtube.com")) {
        messageEmbed.setDescription(`Use ${prefix}play <Youtube URL>`);
        return message.channel.send(messageEmbed);
    }

    //* verifcar permissões
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        messageEmbed.setDescription(locale.permission.connect);
        return message.channel.send(messageEmbed);
    }
    if (!permissions.has("SPEAK")) {
        messageEmbed.setDescription(locale.permission.speak);
        return message.channel.send(messageEmbed);
    }

    //* parametros da queue
    const queueConstruct = {
        textChannel: message.channel,
        channel,
        connection: null,
        songs: [],
        loop: false,
        volume: 100,
        playing: true,
    };

    //* validar o link do video
    let urlValid = await ytdl.validateURL(args);
    let songInfo,
        song = null;

    if (urlValid) {
        try {
            songInfo = await ytdl.getInfo(args);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
        } catch (error) {
            console.log(error);
            return message.reply(error.message);
        }
    }

    if (serverQueue) {
        serverQueue.songs.push(song);
        messageEmbed.setDescription(`\`${song.title}\` ${locale.added} \`${message.author.username}\``);
        return message.channel.send(messageEmbed);
    } else {
        messageEmbed.setDescription(`\`${song.title}\` ${locale.playing} \`${message.author.username}\``);
        message.channel.send(messageEmbed);
    }

    //* adicionar link do video na queue
    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    //* tocar musica
    try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
    } catch (error) {
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        messageEmbed.setDescription(locale.error + error);
        return message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "play",
};
