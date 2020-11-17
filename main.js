// Import all necessary files
const Discord = require('discord.js');
const Wish = require('./wish-sim.js');
const Token = require('./bottoken.js');

const client = new Discord.Client();

const prefix = '!';

client.once('ready', () => {
    console.log('kekw in the chat!');
});

client.on("message", async msg => {
    if (msg.content.startsWith(prefix)){
        let roll;
        switch(msg.content.substring(1).toLowerCase()){
            case "pull1r":
                roll = Wish.regSingle();
                msg.reply(`Here's what you got bitch! Name: ${roll.name} | Rating: ${roll.rating}* | Type: ${roll.type}`, { files: [`./${roll.type}s/${roll.src}`] });
                break;
            case "pull1l":
                roll = Wish.limSingle();
                msg.reply(`Here's what you got bitch! Name: ${roll.name} | Rating: ${roll.rating}* | Type: ${roll.type}`, { files: [`./${roll.type}s/${roll.src}`] });
                break;
            case "pity4r":
                msg.reply(`You are at ${Wish.pity4StarR()} pity for 4* on the regular banner`);
                break;
            case "pity5r":
                msg.reply(`You are at ${Wish.pity5StarR()} pity for 5* on the regular banner`);
                break;
            case "pity4l":
                msg.reply(`You are at ${Wish.pity4StarL()} pity for 4* on the limited banner`);
                break;
            case "pity5l":
                msg.reply(`You are at ${Wish.pity5StarL()} pity for 5* on the limited banner`);
                break;
            case "pull10r":
                msg.reply("Here's what you got!", { files: [await Wish.regMulti()] })
                break;
            case "pull10l":
                msg.reply("Here's what you got!", { files: [await Wish.limMulti()] })
                break;
        }
    }
});

client.login(Token.getToken());