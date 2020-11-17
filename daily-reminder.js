// Parse JSON
const fs = require('fs');

const talentBooks = JSON.parse(fs.readFileSync("./data/talent-book-rotation.json", ));
const weaponMaterials = JSON.parse(fs.readFileSync("./data/weapon-ascension-rotation.json", ));

exports.updateRotation = function(){
    return updateRotation();
}

exports.dailyReminder = function(){
    return dailyReminder();
}

exports.resinReminder = function(){
    return resinReminder(currentResin);
}

function updateRotation(itemJSON) {

    let d = new Date();

    let itemArray = [];

    switch(d.getDay()) {
        case 0:
            for (let i = 0; i < itemJSON.length; i++) {
                itemArray.push(itemJSON[i]);
            }
            break;

        case 1:
            itemArray.push(itemJSON[1]);
            itemArray.push(itemJSON[4]);
            break;

        case 2:
            itemArray.push(itemJSON[2]);
            itemArray.push(itemJSON[5]);
            break;

        case 3:
            itemArray.push(itemJSON[3]);
            itemArray.push(itemJSON[6]);
            break;

        case 4:
            itemArray.push(itemJSON[1]);
            itemArray.push(itemJSON[4]);
            break;

        case 5:
            itemArray.push(itemJSON[2]);
            itemArray.push(itemJSON[5]);
            break;

        case 6:
            itemArray.push(itemJSON[3]);
            itemArray.push(itemJSON[6]);
            break;

        default:
            break;

    }

    return itemArray
}

function dailyReminder() {

    let d = new Date();

    let talentRotation = updateRotation(talentBooks);
    let weaponMatRotation = updateRotation(weaponMaterials);

    let message = "";

    if (d.getDay() == 0) {
        message += "\nWeekly reset occurs tomorrow! Finish up your weekly's!";
    }

    else {
        message += `\nThere are ${8 - d.getDay()} days until weekly reset.`;
    }

    message += `\nThe domain materials today are...${talentRotation[0].name} and ${talentRotation[1].name}`;
    message += `\nThese are for the following characters: ${talentRotation[0].characters}, ${talentRotation[1].characters}`;

    message += `\nThe available Weapon Ascension Materials in Domains are... ${weaponMatRotation[0].name} and ${weaponMatRotation[1].name}`;
    return message;
}

function resinReminder(currentResin) {

    let d = new Date();

    if (currentResin == 160) {
        return "Your resin is at max";
    }
    else if (currentResin != 0) {
        let minutesToResinCap = (160 - currentResin) * 480000;
        d.setDate(d.getMinutes + minutesToResinCap);
        return `"Your resin will be capped in ${Math.floor(minutesToResinCap/60000)}`;

    }
    else {
        return "Your resin is at max";
    }

}