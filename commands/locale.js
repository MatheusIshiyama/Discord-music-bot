const userModel = require("../models/user");
const guildModel = require('../models/guild');
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const guildReq = await guildModel.findOne({ id: message.guild.id });
    const { locale } = require(`../locales/${userReq.locale}.json`);

    const change = locale.change;

    const localeInfo = new MessageEmbed()
        .setTitle(`Locale`)
        .setColor("3498DB")
        .setThumbnail("https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512")
        .setTimestamp(new Date())
        .setFooter(`by ${bot.user.username}`, bot.user.avatarURL());

    if (!args) {
        localeInfo.setDescription(locale.support);
        localeInfo.addField(locale.current, change[0] + `\`${guildReq.prefix}` + change[1]);
        message.channel.send(localeInfo);
    } else if(args === "pt-br") {
        if(userReq.locale === "pt-br") {
            localeInfo.setDescription("O idioma atual é `Português pt-br`");
            message.channel.send(localeInfo);
        } else {
            await userModel.findOneAndUpdate({ id: message.author.id }, { locale: "pt-br" });
            localeInfo.setDescription("O idioma atual foi alterado para `Português \"pt-br\"`");
            message.channel.send(localeInfo);
        }
    } else if(args === "en-us") {
        if(userReq.locale === "en-us") {
            localeInfo.setDescription("The current language is `English en-us`")
            message.channel.send(localeInfo);
        } else {
            await userModel.findOneAndUpdate({ id: message.author.id }, { locale: "en-us" });
            localeInfo.setDescription("The current language was set to `English \"en-us\"`");
            message.channel.send(localeInfo);
        }
    }
};

exports.info = {
    name: "locale",
};
