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
Para navegar entre pastas use o comando cd <nome_da_pasta>

     npm init -y

Após isso, criar um arquivo .js para iniciar a programação (ex. bot.js)

Feito isso, sua pasta terá os arquivos: package.json, package-lock.json, bot.js

crie um arquivo chamado config.json para armazenarmos as keys do bot e da API do youtube, abra o arquivo json e digite

```json
{
     "discordToken":"KEY_DISCORD",
     "youtubeToken":"KEY_API_YOUTUBE",
     "prefix":"COMAND"
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

No arquivo package.json, na linha ["Main":] coloque na frente o nome do arquivo .js (ex. "Main": bot.js)

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

## Subindo o bot no Heroku

### Config Heroku

Vá no site do [Heroku](heroku.com) e faça login, crie um novo app, assim que carregar tudo, vamos configurar o heroku, vá em settings, esse projeto em específico precisa do windows-build-tools, e para isso precisaremos ter esse link https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git para buildar nosso bot, vá em "Buildpacks" e adicione esse link para conseguirmos buildar nosso bot, adicione também o node.js, em settings também, iremos utilizar de variáveis, procurando por "Config vars", dentro criaremos as variáveis discordToken, youtubeToken e o prefix, onde estaremos colocando as mesmas keys que temos no config.json

### Config Bot

No nosso arquivo .js precisaremos adicionar prefixos para o discordToken, youtubeToken e o prefix, que seria o "process.env." (ex. process.env.discordToken).
Ex.

```javascript
const youtube = new Youtube(process.env.youtubeToken);

client.login(process.env.discordToken);
```

precisaremos criar um arquivo chamado Procfile, para enviar comandos para o heroku e dentro dele terá somente:

```Procfile
worker: node bot.js
```

bot.js é o exemplo que utilizamos, mas tem que ser o nome do seu arquivo .js

precisaremos criar um arquivo chamado .gitignore, no qual selecionaremos quais arquivos não serão enviados para o github, no arquivo teremos:

```gitignore
node-modules/
package-lock.json
config.json
```
Após isso, teremos que configurar o git

### Config Github

No [Github](github.com) faça login e crie um repositório limpo (não precisa adicionar o README.md)
Vá no cmd, entre na pasta do bot, e execute esses comandos, lembre-se de instalar o git para executar esses comandos

```
git init
git add .
git commit -m "subindo projeto para o git"
git remote add origin <link_repositorio>
git push origin master
```

### Linkar github com heroku e ligar o bot

Após configurar tudo, precisaremos linkar o repositório do git com a nossa aplicação no heroku, vá no [heroku](heroku.com) e entre em deploy, selecione Github, conect sua conta do git e selecione o repositório e habilite o automatic deploy, para quando você fizer uma alteração no repositório git, o heroku recompilar o arquivo.

Depois disso tudo, vá em Overview e procure por Configure Dynos, lá ligaremos o worker e desligaremos o web, e assim nosso bot estará online, basta conferir no console log, que fica em "more", no canto superior direito "view logs".
