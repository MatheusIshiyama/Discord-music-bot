const userModel = require('../models/user');
const guildModel = require('../models/guild');
const messageEmbed = require("../include/messageEmbed");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ id: message.guild.id });
    const localePrefix = require(`../locales/${userReq.locale}.json`);
    const locale = localePrefix.prefix;
    const prefix = guildReq.prefix;

    messageEmbed.setTitle("Prefix");

    if(!args) {
        messageEmbed.setDescription(`${locale.desc[0]} \`${prefix}\`\n${locale.desc[1]} \`${prefix}${locale.desc[2]}\`.`);
        return message.channel.send(messageEmbed);
    }

    if(args.length > 2) {
        messageEmbed.setDescription(locale.max);
        return message.channel.send(messageEmbed);
    }

    await guildModel.findOneAndUpdate({ serverId: message.guild.id }, { prefix: args });
    messageEmbed.setDescription(`${locale.change} \`${args}\``);
    message.channel.send(messageEmbed);
}

exports.info = {
    name: "prefix"
}