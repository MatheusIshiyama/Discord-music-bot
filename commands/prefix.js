const guildModel = require('../models/guild');
const { embedReply } = require('../include/messages');

exports.run = async (bot, message, args) => {
    const req = await guildModel.findOne({ serverId: message.guild.id });
    let prefix = req.prefix;
    if(!args) {
        return embedReply("Prefix", `O prefix atual é \`${prefix}\`, para editar use \`${prefix}prefix <prefix desejado>\``, message);
    }
    if(args.length > 2) {
        return embedReply("Prefix", "O prefix tem tamanho máximo de 2(dois) caracteres");
    }
    await guildModel.findOneAndUpdate({ serverId: message.guild.id }, { prefix: args });
    return embedReply("Prefix", `Prefix alterado para \`${args}\``, message);
}

exports.info = {
    name: "prefix"
}