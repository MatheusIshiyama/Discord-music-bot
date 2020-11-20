const userModel = require("../models/user");
const guildModel = require("../models/guild");
const { MessageEmbed } = require("discord.js");
const { embedReply } = require("../include/messages");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ userId: message.author.id });
    const guildReq = await guildModel.findOne({ serverId: message.guild.id });

    let resultsEmbed = new MessageEmbed()
        .setTitle(`User Playlist`)
        .setColor("3498DB");

    if (!args) {
        if (!userReq.playlist) {
            return embedReply(
                "User Playlist",
                `use \`${guildReq.prefix}up add\`, to add a playlist link`,
                message
            );
        } else {
            return embedReply("User Playlist", userReq.playlist, message);
        }
    } else if (args == "add") {
        resultsEmbed.addField(
            "Digite o link da playlist",
            "digite `cancel` se quiser cancelar."
        );
        const reply = await message.channel.send(resultsEmbed);
        function filter(msg) {
            return (
                msg.content.includes("cancel") ||
                msg.content.includes("youtube.com/playlist")
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
            embedReply(
                "User Playlist",
                `playlist solicitada ${content}`,
                message
            );
        }
    } else if (args == "remove") {
        return embedReply("User Playlist", args, message);
    }
};

exports.info = {
    name: "up",
};
