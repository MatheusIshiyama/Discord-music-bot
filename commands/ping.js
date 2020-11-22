const userModel = require("../models/user");
const messageEmbed = require("../include/messageEmbed");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { ping } = require(`../locales/${userReq.locale}.json`);

    messageEmbed.setTitle("Ping").setDescription("Ping?");
    m = await message.channel.send(messageEmbed);
    messageEmbed.setDescription(`Pong! ${ping} \`${Date.now() - message.createdTimestamp}ms.\``)
    m.edit(messageEmbed);
};

exports.info = {
    name: "ping",
};
