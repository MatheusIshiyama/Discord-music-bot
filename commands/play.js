const ytdl = require("ytdl-core");
const { play } = require("../include/play");
const { embedSend, embedReply } = require("../include/messages");
try {
    const config = require("../config.json");
    prefix = config.prefix;
} catch (error) {
    prefix = process.env.PREFIX;
}

exports.run = async (bot, message, args) => {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);

    //* verificar se quem solicitou está em um chat de voz
    if (!channel) {
        return embedReply(
            "Play",
            "Entre em algum chat de voz para solicitar uma música",
            message
        );
    }
    
    //* verificar se quem solicitou está no mesmo chat de voz que o bot
    if (serverQueue && channel !== message.guild.me.voice.channel) {
        return embedReply(
            "Play",
            "Para solicitar uma música, você precisa estar conectado no mesmo chat de voz que eu",
            message
        );
    }

    //* verificar se há link de vídeo
    if (!args || !args.includes("youtube.com")) {
        return embedReply("Play", `Use ${prefix}play <Youtube URL>`, message);
    }

    //* verifcar permissões
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        return embedReply(
            "Play",
            "Não tenho permissão para entrar no chat de voz",
            message
        );
    }
    if (!permissions.has("SPEAK")) {
        return embedReply(
            "Play",
            "Não tenho permissão para reproduzir neste chat de voz, verifique as permissões",
            message
        );
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
        return embedSend(
            "Play",
            `${song.title} foi adicionada na queue por ${message.author}`,
            message
        );
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
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return embedSend(
            "Play",
            `Não foi possivel conectar ao chat de voz: ${error}`,
            message
        );
    }
};

exports.info = {
    name: "play",
};
