const Youtube = require("simple-youtube-api");
const userModel = require('../models/user');
const guildModel = require('../models/guild');
const messageEmbed = require('../include/messageEmbed');
const { MessageEmbed } = require("discord.js");
const { youtubeKey } = require('../util/BravanzinUtil');

const youtube = new Youtube(youtubeKey);

exports.run = async (bot, message, args) => {
    const userReq = userModel.findOne({ id: message.author.id });
    const guildReq = guildModel.findOne({ id: message.guild.id });
    const prefix = guildReq.prefix;
    const { search } = require(`../locales/${userReq}.json`);

    messageEmbed.setTitle("Search");

    //* verificar se há link de vídeo
    if (!args.length) {
        messageEmbed.setDescription(`Use ${prefix}search <video>`);
        return message.channel.send(messageEmbed);
    }

    let resultsEmbed = new MessageEmbed()
        .setTitle(search.title)
        .setDescription(`${search.desc} ${args}`)
        .setColor("3498DB")
        .setThumbnail(
            "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512"
        )
        .setTimestamp(new Date())
        .setFooter("by Bravanzin", "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png?size=512");

    try {
        const results = await youtube.searchVideos(args, 10);
        results.map((video, index) =>
            resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`)
        );

        let resultsMessage = await message.channel.send(resultsEmbed);

        function filter(msg) {
            const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
            return pattern.test(msg.content);
        }

        message.channel.activeCollector = true;
        const response = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
        });

        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        console.log(choice);
        message.client.commands.get("play").run(null, message, choice);

        message.channel.activeCollector = false;
        resultsMessage.delete().catch(console.error);
        response.first().delete().catch(console.error);
    } catch (error) {
        console.error(error);
        message.channel.activeCollector = false;
        message.reply(error.message).catch(console.error);
    }
};

exports.info = {
    name: "search",
};
