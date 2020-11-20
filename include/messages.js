module.exports = {
    async embedSend(command, descText, message) {
        message.channel.send({
            embed: {
                color: 3447003,
                title: command,
                description: descText,
                timestamp: new Date(),
                footer: {
                    text: "by Bravanzin",
                    icon_url:
                        "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png",
                },
            },
        });
    },

    async embedReply(command, descText, message) {
        message.reply({
            embed: {
                color: 3447003,
                title: command,
                description: descText,
                timestamp: new Date(),
                footer: {
                    text: "by Bravanzin",
                    icon_url:
                        "https://cdn.discordapp.com/app-icons/688571869275881503/b5bfeb52ddae6f9492925772a59e1f8d.png",
                },
            },
        });
    } 
}