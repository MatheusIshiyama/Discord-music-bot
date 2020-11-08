try {
    const config = require("../config.json");
    prefix = config.prefix;
} catch (error) {
    prefix = process.env.PREFIX;
}

exports.run = async (bot, message, args) => {
    message.channel.send({
        embed: {
            color: 3447003,
            title: "Help",
            thumbnail: {
                url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
            description: `
        ✅ ${bot.user.username} está ativo em ${bot.guilds.cache.size} servidores
        🎵 Tocando música 🎵 para ${bot.users.cache.size} usuários.
        `,
            fields: [
                {
                    name: `Comandos [\`${prefix}\` <comando>]:`,
                    value: `
                    \`clear\` - limpar fila de músicas
                    \`join\` - entrar em um chat de voz
                    \`leave\` - sair de um chat de voz
                    \`loop\` - repetir música queue
                    \`pause\` - pausar música
                    \`ping\` - mostrar o ping
                    \`play <link>\` - tocar música pelo link
                    \`playing\` - mostrar a música que está tocando
                    \`playlist <link>\` - tocar playlist do youtube
                    \`queue\` - mostrar as músicas da fila
                    \`resume\` - despausar música
                    \`shuffle\` - aleatorizar a fila de músicas
                    \`skip\` - pular música atual
                    \`stop\` - parar de tocar música
            `,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: "by Bravanzin",
                icon_url:
                    "https://cdn.discordapp.com/app-icons/690359745420591415/8ca3f1829ce42cc9935bd562c3ead3f9.png",
            },
        },
    });
};

exports.info = {
    name: "help",
};
