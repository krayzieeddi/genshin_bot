const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

const prefix = '!';

const regularBanner = JSON.parse(fs.readFileSync("./data/wanderlust-invocation.json", ));
const limitedBanner = JSON.parse(fs.readFileSync("./data/farewell-of-snezhnaya.json", ));

let fiveStars;
let fourStars;
let threeStars;

let pity5Star = 0;
let pity4Star = 0;
let isLast4StarRateUp = true;
let isLast5StarRateUp = true;

client.once('ready', () => {
    console.log('kekw in the chat!');
});

client.on("message", (msg) => {
    switch(msg.content.substring(1).toLowerCase()){
        case "pull1r":
            regularSinglePull(msg);
            break;
        case "pull1l":
            limitedSinglePull(msg);
            break;
        case "pity4r":
            msg.reply(`You are at ${pity4Star} pity for 4*`);
            break;
        case "pity5r":
            msg.reply(`You are at ${pity5Star} pity for 5*`);
            break;
    }
});

client.login("Nzc2NzYyOTQ5MTE2NzU1OTc4.X65m3g.EblC1TCAHGf_j32TsRn9t5qfHBc");

function limitedSinglePull(msg) {
    updatePools(limitedBanner);
    let pool;
    let isRateUpPull = false;

    if(pity5Star == 0){
        pool = fiveStars;
        pity5Star = 0;
    } else if (pity4Star == 9){
        pool = fourStars;
        pity4Star = 0;
    } else{
        pool = bannerPull();
        updatePity(pool);;
    }

    if(pool[0].rating > 3){
        if(isLast4StarRateUp){
            
        }
    }


    let updatedPool = changePoolBasedOnRateUp(isRateUpPull, pool);

    let ranObj = updatedPool[Math.floor(Math.random() * updatedPool.length)];
    msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });

    // if (pity5Star == 89) {
    //     pool = fiveStars;
    //     let ranObj = fiveStars[Math.round(Math.random() * fiveStars.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
    //     pity5Star = 0;
    // } else if (pity4Star == 0) {
    //     let ranObj = fourStars[Math.round(Math.random() * fourStars.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`,] });
    //     pity5Star = 0;
    // } else {
    //     let ranObj = pool[Math.round(Math.random() * pool.length)];
    //     msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
    //     updatePity(pool);
    // }
}

function regularSinglePull(msg) {
    updatePools(regularBanner);
    let pool = bannerPull();
    if (pity5Star == 89) {
        let ranObj = fiveStars[Math.round(Math.random() * fiveStars.length)];
        msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
        pity5Star = 0;
    } else if (pity4Star == 9) {
        let ranObj = fourStars[Math.round(Math.random() * fourStars.length)];
        msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
        pity4Star = 0;
    } else {
        let ranObj = pool[Math.floor(Math.random() * pool.length)];
        msg.reply(`Here's what you got bitch! Name: ${ranObj.name} | Rating: ${ranObj.rating}* | Type: ${ranObj.type}`, { files: [`./${ranObj.type}s/${ranObj.src}`] });
        updatePity(pool);
    }
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

function updatePity(pool) {
    switch (pool[0].rating) {
        case 4:
            pity4Star = 0;
            pity5Star++;
            break;
        case 5:
            pity4Star++;
            pity5Star = 0;
            break;
        default:
            pity4Star++;
            pity5Star++;
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