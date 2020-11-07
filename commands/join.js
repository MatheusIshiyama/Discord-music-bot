exports.run = (bot, message, args) => {
    message.member.voice.channel.join();
}

exports.info = {
    name: "join"
}