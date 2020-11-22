const userModel = require("../models/user");
const guildModel = require("../models/guild");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const { embedReply } = require("../include/messages");
const { play } = require("../include/play");
const { Playlist } = require("simple-youtube-api");

try {
    const config = require("../config.json");
    youtubeKey = config.youtubeKey;
} catch (error) {
    youtubeKey = process.env.YOUTUBE_KEY;
}
const youtube = new YouTube(youtubeKey);

exports.run = async (bot, message, args) => {
    const user = message.author.id;
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ serverId: message.guild.id });

    let replyEmbed = new MessageEmbed()
        .setTitle(`User Playlist`)
        .setColor("3498DB");

    let playlistEmbed = new MessageEmbed()
        .setTitle(`User Playlist`)
        .setColor("3498DB");

    let editPlaylist = new MessageEmbed()
        .setTitle(`User Playlist`)
        .setColor("3498DB");

    if (!args) {
        if (!userReq.playlist) {
            return embedReply(
                "User Playlist",
                `use \`${guildReq.prefix}up add\`, para adicionar um link de uma playlist`,
                message
            );
        } else {
            playlistEmbed
                .setDescription(`Playlist de ${userReq.name}`)
                .addField(userReq.playlist.title, userReq.playlist.url)
                .setThumbnail(userReq.playlist.thumbnail);
            return message.channel.send(playlistEmbed);
        }
    } else if (args == "add") {
        replyEmbed.addField(
            "Digite o link da playlist",
            "digite `cancel` se quiser cancelar."
        );
        const reply = await message.channel.send(replyEmbed);
        function filter(msg) {
            return (
                (msg.content.includes("cancel") ||
                    msg.content.includes("youtube.com/playlist")) &&
                user === msg.author.id
            );
        }
        message.channel.ativeCollector = true;
        const response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
        });
        message.channel.activeCollector = false;
        reply.delete();
        let content;
        response.map((msg) => {
            content = msg.content;
        });
        if (content == "cancel") {
            embedReply("User Playlist", "Operação cancelada", message);
        } else {
            const playlist = await youtube.getPlaylist(content);
            try {
                if (userReq.playlist.url === null) {
                    await userModel.findOneAndUpdate(
                        { id: message.author.id },
                        {
                            playlist: {
                                title: playlist.title,
                                url: playlist.url,
                                thumbnail: playlist.thumbnails.medium.url,
                            },
                        }
                    );
                    playlistEmbed
                        .addField(playlist.title, playlist.url)
                        .setThumbnail(playlist.thumbnails.medium.url);
                    message.channel.send(playlistEmbed);
                } else {
                    editPlaylist
                        .setDescription(`Playlist atual de ${userReq.name}`)
                        .addField(userReq.playlist.title, userReq.playlist.url)
                        .addField(
                            "Deseja alterar playlist?",
                            "Digite `yes` para alterar ou `no` para não alterar."
                        )
                        .setThumbnail(userReq.playlist.thumbnail);
                    const edit = await message.channel.send(editPlaylist);

                    function filter(msg) {
                        return (
                            (msg.content === "yes" ||
                                msg.content.includes("no")) &&
                            user === msg.author.id
                        );
                    }
                    message.channel.ativeCollector = true;
                    const response = await message.channel.awaitMessages(
                        filter,
                        {
                            max: 1,
                            time: 30000,
                            errors: ["time"],
                        }
                    );
                    message.channel.activeCollector = false;
                    edit.delete();
                    let content;
                    response.map((msg) => {
                        content = msg.content;
                    });
                    if(content === "yes") {
                        await userModel.findOneAndUpdate(
                            { id: message.author.id },
                            {
                                playlist: {
                                    title: playlist.title,
                                    url: playlist.url,
                                    thumbnail: playlist.thumbnails.medium.url,
                                },
                            }
                        );
                        playlistEmbed
                            .setDescription("Playlist atualizada com sucesso")
                            .addField(playlist.title, playlist.url)
                            .setThumbnail(playlist.thumbnails.medium.url);
                        message.channel.send(playlistEmbed);
                    } else {
                        embedReply("User Playlist", "Operação cancelada", message);
                    }
                }
            } catch (error) {
                console.log(error);
                embedReply(
                    "User Playlist",
                    `Link de playlist invalido`,
                    message
                );
            }
        }
    } else if (args == "play") {
        if (!userReq.playlist) {
            return embedReply(
                "User Playlist",
                `use \`${guildReq.prefix}up add\`, para adicionar um link de uma playlist`,
                message
            );
        } else {
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
                playlistInfo = await youtube.getPlaylist(userReq.playlist);
                songs = await playlistInfo.getVideos();
                songs.forEach((song) => {
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
                });
            } catch (error) {
                console.log(error);
                return message.reply(error.message);
            }

            if (!serverQueue) {
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
                    "User playlist",
                    `Não foi possivel conectar ao chat de voz: ${error}`,
                    message
                );
            }
        }
    } else if (args == "remove") {
        return embedReply("User Playlist", args, message);
    }
};

exports.info = {
    name: "up",
};
