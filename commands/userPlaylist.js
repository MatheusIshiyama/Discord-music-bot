const userModel = require("../models/user");
const guildModel = require("../models/guild");
const YouTube = require("simple-youtube-api");
const messageEmbed = require('../include/messageEmbed');
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");

try {
    const config = require("../config.json");
    youtubeKey = config.youtubeKey;
} catch (error) {
    youtubeKey = process.env.YOUTUBE_KEY;
}
const youtube = new YouTube(youtubeKey);

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ id: message.guild.id });
    const { userPlaylist } = require(`../locales/${userReq.locale}.json`);

    const prefix = guildReq.prefix;
    const user = message.author.id;
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    const replyEmbed = new MessageEmbed()
        .setTitle("User Playlist")
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", bot.user.avatarURL());

    const playlistEmbed = new MessageEmbed()
        .setTitle("User Playlist")
        .setColor("3498DB")
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", bot.user.avatarURL());

    const editPlaylist = new MessageEmbed()
        .setTitle("User Playlist")
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", bot.user.avatarURL());

    messageEmbed.setTitle("User Playlist");

    if (!args) {
        if (!userReq.playlist.url) {
            messageEmbed.setDescription(`use \`${guildReq.prefix}up add\`, ${userPlaylist.desc}`);
            return message.channel.send(messageEmbed);
        } else {
            if(userReq.locale === "pt-br") {
                playlistEmbed.setDescription(`Playlist de ${userReq.name}`);
            } else {
                playlistEmbed.setDescription(`${userReq.name}'s playlist`);
            }
            playlistEmbed
                .addField(userReq.playlist.title, userReq.playlist.url)
                .setThumbnail(userReq.playlist.thumbnail);
            return message.channel.send(playlistEmbed);
        }
    } else if (args == "add") {
        replyEmbed.addField(userPlaylist.add.title, userPlaylist.add.desc);
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
            messageEmbed.setDescription(userPlaylist.cancel);
            return message.channel.send(messageEmbed);
        } else {
            const playlist = await youtube.getPlaylist(content);
            try {
                if (!userReq.playlist.url) {
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
                    if(userReq.locale === "pt-br") {
                        editPlaylist.setDescription(`Playlist atual de ${userReq.name}`);
                    } else {
                        editPlaylist.setDescription(`${userReq.name}'s current playlist`);
                    }
                    editPlaylist
                        .addField(userReq.playlist.title, userReq.playlist.url)
                        .addField(userPlaylist.change.title, userPlaylist.change.desc)
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
                            .setDescription(userPlaylist.updated)
                            .addField(playlist.title, playlist.url)
                            .setThumbnail(playlist.thumbnails.medium.url);
                        message.channel.send(playlistEmbed);
                    } else {
                        messageEmbed.setDescription(userPlaylist.cancel);
                        return message.channel.send(messageEmbed);
                    }
                }
            } catch (error) {
                messageEmbed.setDescription(userPlaylist.invalid);
                return message.channel.send(messageEmbed);
            }
        }
    } else if (args == "play") {
        if (!userReq.playlist.url) {
            messageEmbed.setDescription(`${userPlaylist.addFirst}, use \`${prefix}up add\``);
            return message.channel.send(messageEmbed);
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
                playlistInfo = await youtube.getPlaylist(userReq.playlist.url);
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
                messageEmbed.setDescription(userPlaylist.error + error);
                return message.channel.send(messageEmbed);
            }
        }
    } else if (args == "remove") {
        if(!userReq.playlist.url) {
            messageEmbed.setDescription(`${userPlaylist.needed}, use \`${prefix}up add\``);
            return message.channel.send(messageEmbed);
        }
        messageEmbed.setTitle(userPlaylist.confirm.title).setDescription(userPlaylist.confirm.desc);
        const embed = await message.channel.send(messageEmbed);
        function filter(msg) {
            return (
                (msg.content.includes("confirm") ||
                    msg.content.includes("cancel")) &&
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
        embed.delete();
        let content;
        response.map((msg) => {
            content = msg.content;
        });

        if (content === "confirm") {
            await userModel.findOneAndUpdate({ id: message.author.id }, { playlist: { title: null, url: null, thumbnail: null } });
            messageEmbed.setTitle("User playlist").setDescription(userPlaylist.confirm.done);
            return message.channel.send(messageEmbed);
        } else if (content === "cancel") {
            messageEmbed.setTitle("User playlist").setDescription(userPlaylist.cancel);
            return message.channel.send(messageEmbed);
        }
    }
};

exports.info = {
    name: "up",
};
