const Youtube = require('simple-youtube-api');
const userModel = require('../models/user');
const guildModel = require('../models/guild');
const messageEmbed = require('../include/messageEmbed');
const ytdl = require("ytdl-core");
const { play } = require("../include/play");
try {
    const config = require("../config.json");
    youtubeKey = config.youtubeKey
} catch (error) {
    youtubeKey = process.env.YOUTUBE_KEY
}
const youtube = new Youtube(youtubeKey);

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ serverId: message.guild.id });
    const { playlist } = require(`../locales/${userReq.locale}.json`);
    const prefix = guildReq.prefix;

    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Playlist");

    //* verificar se quem solicitou está em um chat de voz
    if (!channel) {
        messageEmbed.setDescription(playlist.channel);
        return message.channel.send(messageEmbed);
    }

    //* verificar se quem solicitou está no mesmo chat de voz que o bot
    if (serverQueue && channel !== message.guild.me.voice.channel) {
        messageEmbed.setDescription(playlist.sameChannel);
        return message.channel.send(messageEmbed);
    }

    //* verificar se há link de vídeo
    if (!args || !args.includes("youtube.com/playlist")) {
        messageEmbed.setDescription(`Use ${prefix}playlist <Youtube Playlist URL> | ${prefix}play <Youtube URL>`);
        return message.channel.send(messageEmbed);
    }

    //* verifcar permissões
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        messageEmbed.setDescription(playlist.permisson.connect);
        return message.channel.send(messageEmbed);
    }
    if (!permissions.has("SPEAK")) {
        messageEmbed.setDescription(playlist.permission.speak);
        return message.channel.send(messageEmbed);
    }

    const queueConstruct = {
        textChannel: message.channel,
        channel,
        connection: null,
        songs: [],
        loop: false,
        volume: 100,
        playing: true,
    };

    let playlistInfo,
        songs = null;

    try {
        playlistInfo = await youtube.getPlaylist(args);
        songs = await playlistInfo.getVideos();
        songs.forEach(song => {
            if (ytdl.validateURL(song.url)) {
                song = {
                    title: song.title,
                    url: song.url,
                };
                
                if (serverQueue) {
                    serverQueue.songs.push(song);
                } else {
                    queueConstruct.songs.push(song);
                }
            }
        })
    } catch (error) {
        console.log(error);
        return message.reply(error.message);
    }
    
    if(!serverQueue) {
        message.client.queue.set(message.guild.id, queueConstruct);
        messageEmbed.setDescription(`\`${playlistInfo.title}\` ${playlist.playing} \`${message.author.username}\``);
        message.channel.send(messageEmbed);
    } else {
        messageEmbed.setDescription(`\`${playlistInfo.title}\` ${playlist.added} \`${message.author.username}\``);
        return message.channel.send(messageEmbed);
    }

    //* tocar musica
    try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
    } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        messageEmbed.setDescription(playlist.error + error);
        message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "playlist",
};
