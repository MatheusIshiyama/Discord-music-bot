# Bot de discord by Bravan

## Config inicial

### requisitos:
Instalar o windows build tools

     npm install --global windows-build-tools

### Dependências:

    npm install discord.js // discord
    npm install node-opus // decoder music
    npm install ffmpeg-static // dependência do decoder
    npm install ytdl-core // youtube player
    npm install simple-youtube-api // youtube search

## Criar o projeto bot e API youtube

### Bot discord

Entre no site do [discord](discordapp.com) e faça login, e vá em developers, e entre em [Developer portal](https://discordapp.com/developers/applications)

## Iniciando o projeto

Inicie o projeto com o comando pelo cmd em uma pasta vazia e instale as dependências

     npm init -y

Após isso, criar um arquivo .js para iniciar a programação (ex. bot.js)

Feito isso, sua pasta terá os arquivos: package.json, package-lock.json, bot.js

## Eventos iniciais do bot


### Console.log quando o bot iniciar

Abra o arquivo .js e faça a requisição do discord.js (a variável <client>, pode ser trocada para qualquer nome)

     const client = new Discord.Client();

     client.on("ready", () +> { //quando o bot iniciar, ele vai fazer...
          console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
          client.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${client.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
     })

ele da o console.log das informações de usuários e canais