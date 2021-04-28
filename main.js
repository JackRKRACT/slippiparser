const { SlippiGame } = require("@slippi/slippi-js");
const fs = require('fs');
const prompt = require('prompt-sync')();

var yourWins = 0;
var yourLoss = 0;
var skippedParsing = 0;
var currFile = 0;

console.clear();
const replayDirectory = prompt('Replay directory : ');//"./replays/";
console.clear();
let files = readDirectory(replayDirectory);
//let tempfiles = files;
// Check for slp extension on files!
//const regex = new RegExp('/.slp/gm');
for (let k = 0; k < files.length; k++) {
    let temp = files[k].toString().split('.').pop();
    if (temp !== "slp") {
        files.splice(k, 1);
        k--;
    }
}
const yourCode = prompt('Your code : ');
console.clear();
const opponentCode = prompt('Opponent code : ');
console.clear();

// Filter results to two player codes

for (let l = 0; l < files.length; l++) {
    //https://www.npmjs.com/package/fs-backwards-stream if I wanna give in to backwards streams
    let current = files[l];
    let filecontents = fs.readFileSync((replayDirectory + current), 'utf8');

    let lines = filecontents.toString().split('\n');
    //console.log(lines.length);
    let short1 = yourCode.toString().split("#")[0];
    let short2 = opponentCode.toString().split("#")[0];
    //console.log(short1 + " " + short2);
    let valid = false;
    let valid2 = false;

    for (let k = lines.length-1; k > lines.length-4; k--) {
        //console.log("This is the number" + k);
        let currentLine = lines[k].toString();
        if (currentLine.includes(short1)) {
            //console.log("We made it here?");
            valid = true;
        }
        if (currentLine.includes(short2)) {
            valid2 = true;
        }
        if (valid && valid2) {
            k = (lines.length-3);
        }
    }

    if (!valid || !valid2) {
        files.splice(l, 1);
        l--;
    }
}

console.log("Filtered .slp files to two player codes.");
const yourCharacterID = Number(prompt('Your character ID : '));
console.clear();
const opponentCharacterID = Number(prompt('Opponent character ID : ')); // Sheik 19 Falcon 0
console.clear();

const totalFile = files.length;
const chunkSize = totalFile / 20;
var i = Math.floor(1/chunkSize);

console.log("Parsing " + totalFile + " games between " + yourCode + " as " + yourCharacterID + " and " + opponentCode + " as " + opponentCharacterID + " within the directory " + replayDirectory);
if (totalFile > 500) {
    console.log("Warning. Attempting parse a large amount of Slippi files, this process can take up to 1 second for each game.")
}
calculateInfo(files);
console.log("\n");
console.log("Wins : " + yourWins + " | Losses : " + yourLoss + " | Skipped : " + skippedParsing);

function readDirectory(directoryName) {
    return fs.readdirSync(directoryName);
}

function calculateInfo(files) {
    /*
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progess : ${currFile}/${totalFile} | [${strCurrent}] `);
    */

    files.forEach(file => {
        currFile++;
        updateProgressBar();
        //console.log(replayDirectory + file);
        const current_game = new SlippiGame(replayDirectory + file);
        const metaData = current_game.getMetadata();
        if (metaData == null) {
            //console.log("null");
            skippedParsing++;
        } else {
            const players = metaData.players;
            const stats = current_game.getStats();
            const settings = current_game.getSettings();
            if (players[0].names.code === yourCode && players[1].names.code === opponentCode) {
                //console.log("Your code is player 1 in this game!");
                // User code is player 1. Opponent code matches desired
                if (settings.players[0].characterId == yourCharacterID && settings.players[1].characterId == opponentCharacterID) {
                    let result1 = determineWin(stats.overall, yourCode, 0);
                    //console.log("We got a match! Result is " + result1);
                    if (result1) {
                        yourWins++;
                    } else {
                        yourLoss++;
                    }
                } else {
                    skippedParsing++;
                }
            } else if (players[1].names.code === yourCode && players[0].names.code === opponentCode) {
                // User code is player 2. Opponent code matches desired.
                //console.log("Match pt1 for port 2.");
                if (settings.players[1].characterId === yourCharacterID && settings.players[0].characterId === opponentCharacterID) {
                    let result2 = determineWin(stats.overall, yourCode, 1);
                    //console.log("We got a match! Result is " + result2);
                    if (result2) {
                        yourWins++;
                    } else {
                        yourLoss++;
                    }
                } else {
                    skippedParsing++;
                }
            } else {
                // Player code does not match for both users. Skipping
                skippedParsing++;
            }
        }
        //console.log("Player 1 : " +  players[0].names.code);
        //console.log("PLayer 2 : " + players[1].names.code);
    })
}

function determineWin(statdata, usercode, userport) {
    return statdata[userport].killCount === 4;
}

function updateProgressBar() {
    if (currFile >= (chunkSize * i)) {
        if (currFile === totalFile) {
            strCurrent = "Finished";
            strEmpty = "";
        } else {
            let str1Temp = "@";
            let str2Temp = "";
            for (let j = 0; j < i; j++) {
                str1Temp += "@";
            }
            for (let k = 20; k > i+1; k--) {
                str2Temp += "_";
            }
            i++;
            strCurrent = str1Temp;
            strEmpty = str2Temp;
        }
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progess : [${strCurrent}${strEmpty}] | ${currFile}/${totalFile}`);
}