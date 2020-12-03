const { Schema, model } = require("mongoose");

const User = Schema({
    id: String,
    name: String,
    locale: String,
    playlist: {
        title: String,
        url: String,
        thumbnail: String,
    },
    favSong: {
        title: String,
        url: String,
        thumbnail: String,
    }
});

module.exports = model("User", User);
