// Import all necessary files
const Discord = require('discord.js');
const Wish = require('./wish-sim.js');
const Token = require('./bottoken.js');
const Daily = require('./daily-reminder.js');

const client = new Discord.Client();

let profiles = [];

const prefix = '!';

client.once('ready', () => {
    console.log('kekw in the chat!');
    client.guilds.cache.array().forEach( async guild => {
        await guild.members.fetch().then(members =>{
            members.array().forEach(member => {
                if(!member.user.bot){
                    let person = {
                        name: member.displayName,
                        id: member.id,
                        resins: 0,
                        pity5L: 0,
                        pity5R: 0,
                        pity4R: 0,
                        pity4L: 0
                    }
                    profiles.push(person);
                }
            })
        })
    })
    setTimeout(() => {Wish.updateProfiles(profiles)}, 2000);
});

client.on("message", async msg => {
    if (msg.content.startsWith(prefix)){
        let roll;
        switch(msg.content.substring(1).toLowerCase()){
            case "pull1r":
                roll = Wish.regSingle(msg.author.id);
                msg.reply(`Here's what you got bitch! Name: ${roll.name} | Rating: ${roll.rating}* | Type: ${roll.type}`, { files: [`./${roll.type}s/${roll.src}`] });
                break;
            case "pull1l":
                roll = Wish.limSingle(msg.author.id);
                msg.reply(`Here's what you got bitch! Name: ${roll.name} | Rating: ${roll.rating}* | Type: ${roll.type}`, { files: [`./${roll.type}s/${roll.src}`] });
                break;
            case "pity5r":
                msg.reply(`You are at ${Wish.pity5StarR(msg.author.id)} pity for 5* on the regular banner`);
                break;
            case "pity5l":
                msg.reply(`You are at ${Wish.pity5StarL(msg.author.id)} pity for 5* on the limited banner`);
                break;
            case "pull10r":
                msg.reply("Here's what you got!", { files: [await Wish.regMulti(msg.author.id)] })
                break;
            case "pull10l":
                msg.reply("Here's what you got!", { files: [await Wish.limMulti(msg.author.id)] })
                break;
            case "testremind":
                msg.reply(Daily.dailyReminder());
                break;
        }
    }
});

client.login(Token.getToken());