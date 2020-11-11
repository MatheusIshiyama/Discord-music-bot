const Youtube = require("simple-youtube-api");
const { MessageEmbed } = require("discord.js");
try {
    const config = require("../config.json");
    youtubeKey = config.youtubeKey;
} catch (error) {
    youtubeKey = process.env.YOUTUBE_KEY;
}
const youtube = new Youtube(youtubeKey);

exports.run = async (bot, message, args) => {
    //* verificar se há link de vídeo
    if (!args.length) {
        return embedReply("Search", `Use ${prefix}search <video>`, message);
    }

    let resultsEmbed = new MessageEmbed()
        .setTitle(`**DIgite o número da música que queira tocar**`)
        .setDescription(`Resultados para: ${args}`)
        .setColor("3498DB");

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
