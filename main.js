// Import all necessary files
const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');
const Token = require('./bottoken.js')

const client = new Discord.Client();

const prefix = '!';

// Parse all JSON files
const regularBanner = JSON.parse(fs.readFileSync("./data/wanderlust-invocation.json", ));
const limitedBanner = JSON.parse(fs.readFileSync("./data/farewell-of-snezhnaya.json", ));

// Initiate arrays to contain and sort all possible ratings(3*, 4*, 5*)
let fiveStars;
let fourStars;
let threeStars;

// Global variables to be used and reference in the function
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

client.on("message", async msg => {
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
                multiRolls = await combineAllPic(regularPull);
                msg.reply("Here's what you got!", { files: [multiRolls] })
                break;
            case "pull10l":
                multiRolls = await combineAllPic(limitPull);
                msg.reply("Here's what you got!", { files: [multiRolls] })
                break;
        }
    }
});

client.login(Token.getToken());

// function that makes a single picture by combining all the picture you get from doing multi pulls
async function combineAllPic(typeOfPull) {
    // creates a canvas with the dimension
    let canvas = Canvas.createCanvas(1400, 560);
    let ctx = canvas.getContext('2d');
    // variables for the location to put the picture on the canvas
    let x = 0;
    let y = 0;

    for (i = 0; i < 10; i++) {
        // to separate the picture to 2 rows and 5 columns
        if (x >= 1400) {
            x = 0;
            y += 280;
        }

        // variable to contain the object that was pulled based on the type of banner
        urRoll = typeOfPull();
        // draws the image of the object to the right location in the canvas
        ctx.drawImage(await Canvas.loadImage(`./${urRoll.type}s/${urRoll.src}`), x, y, 280, 280);
        x += 280;
    }

    return new Discord.MessageAttachment(canvas.toBuffer(), 'multipulls.png');
}

// limited banner single pull implementation
let limitPull = function limitedSinglePull() {
    // sets up the three array
    updatePools(limitedBanner);
    // variable to contain the appropriate pool (3*, 4*, 5*)
    let pool;
    let isRateUpPull = false;

    // checks the pity first, and assigns the correct array of objects based on conditions
    if(pity5StarL == 89){
        pool = fiveStars;
        pity5StarL = 0;
        pity4StarL++;
    } else if (pity4StarL == 9){
        pool = fourStars;
        pity4StarL = 0;
        pity5StarL++;
    } else{                             // runs if the pity hasn't been hit yet
        pool = bannerPull();
        updatePity(pool, 'lim');
    }

    // checks if the the last character that was pulled is a rate up character on the banner
    if(pool[0].rating == 4){                // implementation for 4* character rate up
        if(isLast4StarRateUp){
            isRateUpPull = Math.round(Math.random()) == 1;
            if(!isRateUpPull){
                isLast4StarRateUp = false;
            }
        } else {
            isRateUpPull = true;
        }
    } else if (pool[0].rating == 5){        // implementation for 5* character rate up
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

    // picks a random object in the array of objects
    return ranObj = updatedPool[Math.floor(Math.random() * updatedPool.length)];
}

// pretty much the same implementation as the limited banner
let regularPull = function regularSinglePull() {
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
}

// function that updates the array of 3-5* arrays based on the boolean isRateUpPull
function changePoolBasedOnRateUp(isRateUpPull, pool){
    let newPool = [];
    // makes sure that the elements of the array are only the featured ones if true
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

// uses RNG to choose a specific array out of the three based on the random number
function bannerPull(){
    let ranNum = Math.round(Math.random() * 1000);
    // (0 - 5) 0.6% chance
    if(ranNum < 6)
        return fiveStars;
    // (6 - 57) 5.1% chance
    else if(ranNum >= 6 && ranNum < 57)
        return fourStars;
    else
        return threeStars;

}

// a function that sets up the three arrays based on the banner type
function updatePools(bannerData) {
    // makes sure that the arrays have 0 elements before updating them
    fiveStars = [];
    fourStars = [];
    threeStars = [];

    // loops through every object in the banner data and filters them based in their rating property
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

    // shuffles the array for a fair RNG
    shuffleArray(fiveStars);
    shuffleArray(fourStars);
    shuffleArray(threeStars);
}

// an efficient algorithm for shuffling array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}