exports.run = (bot, message, args) => {
    //* verificar se quem solicitou está em um chat de voz
    if (!channel) {
        return embedReply(
            "Play",
            "Entre em algum chat de voz para que eu possa entrar",
            message
        );
    }

    //* verifcar permissões
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
        return embedReply(
            "Play",
            "Não tenho permissão para entrar no chat de voz",
            message
        );
    }
    message.member.voice.channel.join();
};

exports.info = {
    name: "join",
};
