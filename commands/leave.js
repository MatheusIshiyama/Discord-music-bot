exports.run = async (bot, message, args) => {
    message.member.voice.channel.leave();
};

exports.info = {
    name: "leave",
};
