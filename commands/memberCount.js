const { MessageEmbed } = require("discord.js");
const guildModel = require("../models/guild");
const { countUpdate } = require("../include/memberUpdate");

exports.run = async (bot, message, args) => {
    const userReq = message.author.id;
    let channelsInfo = [];
    let content;
    let resultsEmbed = new MessageEmbed()
        .setTitle(`Escolha um canal de voz`)
        .setColor("3498DB");

    const channels = await message.guild.channels.cache.filter(
        (channels) => channels.type === "voice"
    );
    channels.map((channel) => {
        resultsEmbed.addField(channel.name, "canal de voz");
        channelsInfo.push({ id: channel.id, name: channel.name });
    });

    const m = await message.channel.send(resultsEmbed);

    function filter(msg) {
        return userReq === msg.author.id;
    }

    message.channel.ativeCollector = true;
    const response = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ["time"],
    });
    message.channel.activeCollector = false;
    m.delete();
    response.map((msg) => {
        content = msg.content;
    });
    if (content === "cancel") {
        return message.reply("operacao cancelada");
    }
    const voiceChannel = channelsInfo.find(
        (channelInfo) => channelInfo.name === content
    );
    if (voiceChannel != null) {
        message.channel.send(`Canal escolhido \`${content}\``);
        await guildModel.findOneAndUpdate(
            { serverId: message.guild.id },
            { memberCountId: voiceChannel.id }
        );
    } else {
        message.channel.send("Canal escolhido não existe, tente novamente");
    }

    countUpdate(message.guild);
};

exports.info = {
    name: "mcount",
};