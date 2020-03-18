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

Entre no site do [Discord](discordapp.com) e faça login, e vá em developers, e entre em [Developer portal](https://discordapp.com/developers/applications). Após isso, criar uma nova aplicação e dê um nome ao projeto, logo em seguida, entre na aba de "Bot" e crie um bot, lá teremos o token do bot que é essencial para fazermos funcionar.

Para colocar o bot em um servidor Discord, basta pegar o ID do projeto, que fica nas informações gerais do projeto, chamada de CLIENT ID e colar no lugar da variável

     https://discordapp.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=8

     Ex: https://discordapp.com/oauth2/authorize?client_id=16849416418615&scope=bot&permissions=8  // número digitado aleatóriamente

### API youtube

Entre no [Google Cloud Platform](https://cloud.google.com), faça login pela google e entre em console, crie um novo projeto e vá em "API e Serviços", clique em "+ ATIVAR API E SERVIÇOS", procure por Youtube e selecione "Youtube Data API v3" e adicione ao projeto, logo após isso, vá em credenciais e crie uma chave API da API do youtube.

## Iniciando o projeto

Inicie o projeto com o comando pelo cmd em uma pasta vazia e instale as dependências

     npm init -y

Após isso, criar um arquivo .js para iniciar a programação (ex. bot.js)

Feito isso, sua pasta terá os arquivos: package.json, package-lock.json, bot.js

crie um arquivo chamado config.json para armazenarmos as keys do bot e da API do youtube, abra o arquivo json e digite

```json
{
     discordToken:"KEY_DISCORD",
     youtubeToken:"KEY_API_YOUTUBE",
     prefix:"COMAND"
}
```
o KEY_DISCORD e o KEY_API_YOUTUBE são as keys foram geradas antes de iniciarmos o projeto, e o COMAND do prefix é o comando que usaremos para acionar o bot (ex. "!" => {!play, !info})

Agora temos os arquivos config.json, package.json, package-lock.json, bot.js

No arquivo .js vamos configurar as keys

```javascript
const config = require("config.json");
const client = new Discord.Client();
const Youtube = require("simple-youtube-api");
const youtube = new Youtube(config.youtubeToken);

client.login(config.discordToken);
```

Com isso, configuramos as keys.

## Eventos iniciais do bot


### Console.log quando o bot iniciar

Abra o arquivo .js e faça a requisição do discord.js (a variável <client>, pode ser trocada para qualquer nome)

```javascript
const client = new Discord.Client();

client.on("ready", () +> { //quando o bot iniciar, ele vai fazer...
     console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
     client.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${client.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
})
```

ele da o console.log das informações de usuários e canais e configura para o bot ficar em modo(type) transmissão, mas você pode alterar o type(0 = jogando; 1 = transmitindo; 2 = Ouvindo; 3 = Assistindo)

### Executar uma função

```javascript
client.on("message", message => {
     if(message.author.bot) return;
     if(message.channel.type === 'dm') return;
     if(!message.guild) return;

     // para ler o comando
     const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
     const comand = args.shift().toLowerCase();

     // executar algum comando
     if(comand === "teste") {
          message.channel.send("Testando...");
          message.edit("Funcionando perfeitamente");
     }

     // proximo comando
     else if(comando === "beep") {
          message.reply("boop");
     }
})

```

### Exemplo de código

```javascript
const config = require("config.json");
const client = new Discord.Client();
const Youtube = require("simple-youtube-api");
const youtube = new Youtube(config.youtubeToken);

client.on("ready", () +> { //quando o bot iniciar, ele vai fazer...
     console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`);
     client.user.setPresence( {activity: { name: `twitch.tv/bravanzin para ${client.users.cache.size} viewers`, type: 1, url: 'https://twitch.tv/bravanzin' }} );
});

client.on("message", message => {
     if(message.author.bot) return;
     if(message.channel.type === 'dm') return;
     if(!message.guild) return;

     // para ler o comando
     const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
     const comand = args.shift().toLowerCase();

     // executar algum comando
     if(comand === "teste") {
          message.channel.send("Testando...");
          message.edit("Funcionando perfeitamente");
     }

     // proximo comando
     else if(comando === "beep") {
          message.reply("boop");
     }
});

```