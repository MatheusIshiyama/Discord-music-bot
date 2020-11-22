const userModel = require('../models/user');
const messageEmbed = require('../include/messageEmbed');

exports.run = async (bot, message, args) => {
    const userReq = await userModel.findOne({ id: message.author.id });
    const { loop } = require(`../locales/${userReq.locale}.json`);

    const queue = message.client.queue.get(message.guild.id);
    messageEmbed.setTitle("Loop");

    if (!queue) {
        messageEmbed.setDescription(loop.queue);
        return message.channel.send(messageEmbed);
    } else {
        queue.loop = !queue.loop;
        messageEmbed.setDescription(`${loop.state.desc} \`${queue.loop ? loop.state.on : loop.state.off}\``);
        return message.channel.send(messageEmbed);
    }
};

exports.info = {
    name: "loop",
};
