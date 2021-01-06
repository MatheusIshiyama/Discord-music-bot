const mongoose = require("mongoose");
const { mongoUri } = require('../util/BravanzinUtil');

mongoose
    .connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(console.log("[Database] conectado ao mongo"))
    .catch((err) => console.log(err));