const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

const prefix = '!';

const regularBanner = JSON.parse(fs.readFileSync("./data/wanderlust-invocation.json", ));
const limitedBanner = JSON.parse(fs.readFileSync("./data/farewell-of-snezhnaya.json", ));

let fiveStars;
let fourStars;
let threeStars;

let urRoll;
let multiRolls;

let pity5StarR = 0;
let pity4StarR = 0;
let pity5StarL = 0;
let pity4StarL = 0;
let isLast4StarRateUp = true;
let isLast5StarRateUp = true;

client.once('ready', () => {
    console.log('kekw in the chat!');
});

client.on("message", (msg) => {
    if (msg.content.startsWith(prefix)){
        switch(msg.content.substring(1).toLowerCase()){
            case "pull1r":
                urRoll = regularSinglePull();
                msg.reply(`Here's what you got bitch! Name: ${urRoll.name} | Rating: ${urRoll.rating}* | Type: ${urRoll.type}`, { files: [`./${urRoll.type}s/${urRoll.src}`] });
                break;
            case "pull1l":
                urRoll = limitedSinglePull();
                msg.reply(`Here's what you got bitch! Name: ${urRoll.name} | Rating: ${urRoll.rating}* | Type: ${urRoll.type}`, { files: [`./${urRoll.type}s/${urRoll.src}`] });
                break;
            case "pity4r":
                msg.reply(`You are at ${pity4StarR} pity for 4* on the regular banner`);
                break;
            case "pity5r":
                msg.reply(`You are at ${pity5StarR} pity for 5* on the regular banner`);
                break;
            case "pity4l":
                msg.reply(`You are at ${pity4StarL} pity for 4* on the limited banner`);
                break;
            case "pity5l":
                msg.reply(`You are at ${pity5StarL} pity for 5* on the limited banner`);
                break;
            case "pull10r":
                multiRolls = [];
                for(i = 0; i < 10; i++){
                    urRoll = regularSinglePull();
                    multiRolls.push(`./${urRoll.type}s/${urRoll.src}`);
                }
                msg.reply("Here's what you got!", { files: multiRolls })
                break;
            case "pull10l":
                multiRolls = [];
                for(i = 0; i < 10; i++){
                    urRoll = limitedSinglePull();
                    multiRolls.push(`./${urRoll.type}s/${urRoll.src}`);
                }
                msg.reply("Here's what you got!", { files: multiRolls })
                break;
        }
    }
});

client.login("Nzc3ODkxODE0NjM5NDAzMDI4.X7KCNQ.CEGn0WYlz9lEnvtLOtwRzpWRs3o");

function limitedSinglePull() {
    updatePools(limitedBanner);
    let pool;
    let isRateUpPull = false;

    if(pity5StarL == 89){
        pool = fiveStars;
        pity5StarL = 0;
        pity4StarL++;
    } else if (pity4StarL == 9){
        pool = fourStars;
        pity4StarL = 0;
        pity5StarL++;
    } else{
        pool = bannerPull();
        updatePity(pool, 'lim');
    }

    if(pool[0].rating == 4){
        if(isLast4StarRateUp){
            isRateUpPull = Math.round(Math.random()) == 1;
            if(!isRateUpPull){
                isLast4StarRateUp = false;
            }
        } else {
            isRateUpPull = true;
        }
    } else if (pool[0].rating == 5){
        if(isLast5StarRateUp){
            isRateUpPull = Math.round(Math.random()) == 1;
            if(!isRateUpPull){
                isLast5StarRateUp = false;
            }
        } else {
            isRateUpPull = true;
        }
    }

    let updatedPool = changePoolBasedOnRateUp(isRateUpPull, pool);

    return ranObj = updatedPool[Math.floor(Math.random() * updatedPool.length)];
}

function regularSinglePull() {
    updatePools(regularBanner);
    let pool;

    if(pity5StarR == 89){
        pool = fiveStars;
        pity5StarR = 0;
        pity4StarR++;
    } else if (pity4StarR == 9){
        pool = fourStars;
        pity4StarR = 0;
        pity5StarR++;
    } else{
        pool = bannerPull();
        updatePity(pool, 'reg');
    }
    return ranObj = pool[Math.floor(Math.random() * pool.length)];
    // if (pity5StarR == 89) {
    //     let ranObj = fiveStars[Math.floor(Math.random() * fiveStars.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
    //     pity5StarR = 0;
    // } else if (pity4StarR == 9) {
    //     let ranObj = fourStars[Math.floor(Math.random() * fourStars.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
    //     pity4StarR = 0;
    // } else {
    //     let ranObj = pool[Math.floor(Math.random() * pool.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
    //     updatePity(pool, 'reg');
    // }
}

function changePoolBasedOnRateUp(isRateUpPull, pool){
    let newPool = [];
    if(isRateUpPull){
        pool.forEach(i => {
            if(i.isFeatured == true)
                newPool.push(i);
        });
        return newPool;
    } else {
        return pool;
    }
}

function updatePity(pool, bannerType) {
    switch (pool[0].rating) {
        case 4:
            if(bannerType == 'lim'){
                pity4StarL = 0;
                pity5StarL++;
            } else {
                pity4StarR = 0;
                pity5StarR++;
            }
            break;
        case 5:
            if(bannerType == 'lim'){
                pity4StarL++;
                pity5StarL = 0;
            } else {
                pity4StarR++;
                pity5StarR = 0;
            }
            break;
        default:
            if(bannerType == 'lim'){
                pity4StarL++;
                pity5StarL++;
            } else {
                pity4StarR++;
                pity5StarR++;
            }
            break;
    }
}

function bannerPull(){
    let ranNum = Math.round(Math.random() * 1000);
    if(ranNum < 6)
        return fiveStars;
    else if(ranNum >= 6 && ranNum < 57)
        return fourStars;
    else
        return threeStars;

}

function updatePools(bannerData) {
    fiveStars = [];
    fourStars = [];
    threeStars = [];

    bannerData.forEach(i => {
        switch (i.rating) {
            case 5:
                fiveStars.push(i);
                break;
            case 4:
                fourStars.push(i);
                break;
            case 3:
                threeStars.push(i);
                break;
        }
    });

    shuffleArray(fiveStars);
    shuffleArray(fourStars);
    shuffleArray(threeStars);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}