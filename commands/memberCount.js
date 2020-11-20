const { MessageEmbed } = require("discord.js");
const guildModel = require('../models/guild');
const { countUpdate } = require('../include/memberUpdate');

exports.run = async (bot, message, args) => {
    let channelsInfo = [];
    let channel;
    let resultsEmbed = new MessageEmbed()
        .setTitle(`Escolha um canal de voz`)
        .setColor("3498DB");

    const channels = await message.guild.channels.cache.filter(
        (channels) => channels.type === "voice"
    );
    channels.map((channel) => {
        resultsEmbed.addField(channel.name, 'canal de voz');
        channelsInfo.push({ id: channel.id, name: channel.name });
    });

    const m = await message.channel.send(resultsEmbed);

    function filter(msg) {
        return msg != null;
    }

    message.channel.ativeCollector = true;
    const response = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ["time"],
    });
    message.channel.activeCollector = false;
    m.delete()
    response.map(msg => {
        channel = msg.content;
    });
    message.channel.send(`Canal escolhido \`${channel}\``);
    const voiceChannel = channelsInfo.find(channelInfo => channelInfo.name === channel);
    await guildModel.findOneAndUpdate({ serverId: message.guild.id }, { memberCountId: voiceChannel.id });

    countUpdate(message.guild);

};

exports.info = {
    name: "mcount"
}