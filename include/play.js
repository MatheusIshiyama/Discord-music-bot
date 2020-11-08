const ytdlDiscord = require("ytdl-core-discord");

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);

        if (!song) {
            queue.channel.leave();
            message.client.queue.delete(message.guild.id);
            return queue.textChannel.send("🚫 A fila de musicas acabou.");
        }

        let stream = null;
        let streamType = "opus";

        try {
            stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
        } catch (error) {
            if (queue) {
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }

            console.error(error);
            return message.channel.send(
                `Error: ${error.message ? error.message : error}`
            );
        }

        queue.connection.on("disconnect", () =>
            message.client.queue.delete(message.guild.id)
        );

        const dispatcher = queue.connection
            .play(stream, { type: streamType })
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
