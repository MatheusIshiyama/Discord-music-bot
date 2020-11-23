const userModel = require("../models/user");
const guildModel = require("../models/guild");
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    let prefix;
    try {
        const guildReq = await guildModel.findOne({ serverId: message.guild.id });
        prefix = guildReq.prefix;
    } catch (error) {
        prefix = ";"
    }
    const { help } = require(`../locales/${userReq.locale}.json`);

    const commands = help.commands;

    const msg = new MessageEmbed()
        .setTitle("Help")
        .setDescription(
            `\`${bot.user.username}\` ${help.desc[0]} ${bot.guilds.cache.size} ${help.desc[1]}
            ${help.desc[2]} \`${bot.users.cache.size}\` ${help.desc[3]}
        `
        )
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .addFields(
            {
                name: `${help.command.title} \`${prefix}<${help.command.desc}>\``,
                value: `\u200b`,
            },
            {
                name: "clear",
                value: commands.clear,
            },
            {
                name: "join",
                value: commands.join
            },
            {
                name: "leave",
                value: commands.leave
            },
            {
                name: "locale",
                value: commands.locale
            },
            {
                name: "loop",
                value: commands.loop
            },
            {
                name: "me",
                value: commands.me
            },
            {
                name: "mcount",
                value: commands.mcount
            },
            {
                name: "pause",
                value: commands.pause
            },
            {
                name: "ping",
                value: commands.ping
            },
            {
                name: "play <Youtube link>",
                value: commands.play
            },
            {
                name: "playing",
                value: commands.playing
            },
            {
                name: "playlist",
                value: commands.playlist
            },
            {
                name: "prefix",
                value: commands.prefix
            },
            {
                name: "queue",
                value: commands.queue
            },
            {
                name: "resume",
                value: commands.resume
            },
            {
                name: `search <${commands.search.title}>`,
                value: commands.search.desc
            },
            {
                name: "server",
                value: commands.server
            },
            {
                name: "shuffle",
                value: commands.shuffle
            },
            {
                name: "skip",
                value: commands.skip
            },
            {
                name: "stop",
                value: commands.stop
            },
            {
                name: "up",
                value: commands.up
            }
        )
        .setTimestamp(new Date())
        .setFooter(
            "by Bravanzin",
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        );
    message.channel.send(msg);
};

exports.info = {
    name: "help",
};
