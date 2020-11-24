const guildModel = require("../models/guild");
const userModel = require("../models/user");
const { MessageEmbed } = require("discord.js");
const { countUpdate } = require("../include/memberUpdate");

exports.run = async (bot, message, args) => {
    const userId = message.author.id;
    const userReq = await userModel.findOne({ id: userId });
    const { memberCount } = require(`../locales/${userReq.locale}.json`);

    let channelsInfo = [];
    let content;
    
    const channelEmbed = new MessageEmbed()
        .setTitle(`Member Count`)
        .setDescription(memberCount.desc)
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512");

    const invalidEmbed = new MessageEmbed()
        .setTitle(`Member Count`)        
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512");

    const channels = await message.guild.channels.cache.filter(
        (channels) => channels.type === "voice"
    );
    channels.map((channel) => {
        channelEmbed.addField(channel.name, memberCount.type);
        channelsInfo.push({ id: channel.id, name: channel.name });
    });
    channelEmbed.addField(memberCount.cancel.title, memberCount.cancel.desc);

    const m = await message.channel.send(channelEmbed);

    function filter(msg) {
        return userId === msg.author.id;
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
        invalidEmbed.setDescription(memberCount.canceled);
        return message.channel.send(invalidEmbed);
    }

    const voiceChannel = channelsInfo.find(
        (channelInfo) => channelInfo.name === content
    );

    if (voiceChannel != null) {
        message.channel.send(`Canal escolhido \`${content}\``);
        await guildModel.findOneAndUpdate(
            { id: message.guild.id },
            { mcountId: voiceChannel.id }
        );
    } else {
        invalidEmbed.setDescription(memberCount.invalid);
        message.channel.send(invalidEmbed);
    }

    countUpdate(message.guild);
};

exports.info = {
    name: "mcount",
};