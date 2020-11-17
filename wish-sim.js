// Import all necessary files
const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');

const client = new Discord.Client();

// Parse all JSON files
const regularBanner = JSON.parse(fs.readFileSync("./data/wanderlust-invocation.json", ));
const limitedBanner = JSON.parse(fs.readFileSync("./data/farewell-of-snezhnaya.json", ));

// Initiate arrays to contain and sort all possible ratings(3*, 4*, 5*)
let fiveStars;
let fourStars;
let threeStars;

// Global variables to be used and reference in the function
let urRoll;

let isLast4StarRateUp = true;
let isLast5StarRateUp = true;

let profiles = [];

exports.updateProfiles = function(profile){
    profiles = profile;
}

exports.limMulti = function(id){
    return combineAllPic(limitPull, id);
}

exports.regMulti = function(id){
    return combineAllPic(regularPull, id);
}

exports.regSingle = function(id){
    return regularPull(id);
}

exports.limSingle = function(id){
    return limitPull(id);
}

exports.pity5StarL = function(id){
    return profiles.find(x => x.id == id).pity5L;
}

exports.pity5StarR = function(id){
    return profiles.find(x => x.id == id).pity5R;
}

// function that makes a single picture by combining all the picture you get from doing multi pulls
async function combineAllPic(typeOfPull, id) {
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
        urRoll = typeOfPull(id);
        // draws the image of the object to the right location in the canvas
        ctx.drawImage(await Canvas.loadImage(`./${urRoll.type}s/${urRoll.src}`), x, y, 280, 280);
        x += 280;
    }

    return new Discord.MessageAttachment(canvas.toBuffer(), 'multipulls.png');
}

// limited banner single pull implementation
let limitPull = function limitedSinglePull(id) {
    // sets up the three array
    updatePools(limitedBanner);
    // variable to contain the appropriate pool (3*, 4*, 5*)
    let pool;
    let isRateUpPull = false;
    let puller = profiles.find(x => x.id == id);

    // checks the pity first, and assigns the correct array of objects based on conditions
    if(puller.pity5L == 89){
        pool = fiveStars;
        puller.pity5L = 0;
        puller.pity4L++;
    } else if (puller.pity4L == 9){
        pool = fourStars;
        puller.pity4L = 0;
        puller.pity5L++;
    } else{                             // runs if the pity hasn't been hit yet
        pool = bannerPull();
        updatePity(pool,id, 'lim');
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
let regularPull = function regularSinglePull(id) {
    updatePools(regularBanner);
    let pool;
    let puller = profiles.find(x => x.id == id);
    if(puller.pity5R == 89){
        pool = fiveStars;
        puller.pity5R = 0;
        puller.pity4R++;
    } else if (puller.pity4R == 9){
        pool = fourStars;
        puller.pity4R = 0;
        puller.pity5R++;
    } else{
        pool = bannerPull();
        updatePity(pool, id, 'reg');
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

function updatePity(pool, id, bannerType) {
    let puller = profiles.find(x => x.id == id);
    switch (pool[0].rating) {
        case 4:
            if(bannerType == 'lim'){
                puller.pity4L = 0;
                puller.pity5L++;
            } else {
                puller.pity4R = 0;
                puller.pity5R++;
            }
            break;
        case 5:
            if(bannerType == 'lim'){
                puller.pity4L++;
                puller.pity5L = 0;
            } else {
                puller.pity4R++;
                puller.pity5R = 0;
            }
            break;
        default:
            if(bannerType == 'lim'){
                puller.pity4L++;
                puller.pity5L++;
            } else {
                puller.pity4R++;
                puller.pity5R++;
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