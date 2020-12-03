const ytdl = require("ytdl-core");

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);
        const { include } = require(`../locales/${queue.locale}.json`);

        if (!song) {
            queue.channel.leave();
            message.client.queue.delete(message.guild.id);
            return queue.textChannel.send(include.play);
        }

        let stream = null;

        try {
            stream = await ytdl(song.url);
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }

            return console.error(error);
        }

        queue.connection.on("disconnect", () =>
            message.client.queue.delete(message.guild.id)
        );

        const dispatcher = queue.connection
            .play(stream)
            .on("finish", () => {
                if (queue.loop) {
                    //* se o "loop" estiver on, a musica vai voltar para o final da fila, assim repetindo infinitamente
                    let lastSong = queue.songs.shift();
                    queue.songs.push(lastSong);
                    module.exports.play(queue.songs[0], message);
                } else {
                    //* seguindo a fila de musicas normalmente
                    queue.songs.shift();
                    module.exports.play(queue.songs[0], message);
                }
            })
            .on("error", (err) => {
                console.error(err);
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);
    },
};
