const Youtube = require('simple-youtube-api');
const ytdl = require("ytdl-core");
const { play } = require("../include/play");
const { embedSend, embedReply } = require("../include/messages");
try {
    const config = require("../config.json");
    prefix = config.prefix;
    youtubeKey = config.youtubeKey
} catch (error) {
    prefix = process.env.PREFIX;
    youtubeKey = process.env.YOUTUBE_KEY
}
const youtube = new Youtube(youtubeKey);

exports.run = async (bot, message, args) => {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);

    //* verificar se quem solicitou está em um chat de voz
    if (!channel) {
        return embedReply(
            "Playlist",
            "Entre em algum chat de voz para solicitar uma música",
            message
        );
    }
    //* verificar se quem solicitou está no mesmo chat de voz que o bot
    if (serverQueue && channel !== message.guild.me.voice.channel) {
        return embedReply(
            "Playlist",
            "Para solicitar uma música, você precisa estar conectado no mesmo chat de voz que eu",
            message
        );
    }

    //* verificar se há link de vídeo
    if (!args || !args.length || !args.includes("youtube.com/playlist")) {
        return embedReply(
            "Playlist",
            `Use ${prefix}playlist <Youtube Playlist URL> | ${prefix}play <Youtube URL> | ${prefix}search <pesquisa>`,
            message
        );
    }

    //* verifcar permissões
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        return embedReply(
            "Playlist",
            "Não tenho permissão para entrar no chat de voz",
            message
        );
    }
    if (!permissions.has("SPEAK")) {
        return embedReply(
            "Playlist",
            "Não tenho permissão para reproduzir neste chat de voz, verifique as permissões",
            message
        );
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
        playlistSize,
        songs,
        song = null;

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
        return embedSend(
            "Playlist",
            `Não foi possivel conectar ao chat de voz: ${error}`,
            message
        );
    }
};

exports.info = {
    name: "playlist",
};
