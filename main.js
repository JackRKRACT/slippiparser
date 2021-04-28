const { SlippiGame } = require("@slippi/slippi-js");
const fs = require('fs');
const prompt = require('prompt-sync')();
const Match = require("./match");

/*
// Update April 28th : Not tracking your wins in new version
var yourWins = 0;
var yourLoss = 0;
 */

var currFile = 0;
var skippedParsing = 0;
var matchArray = [];
var totalFile;


console.clear();
const replayDirectory = prompt('Replay directory : ');//"./replays/";
console.clear();
let files = readDirectory(replayDirectory);
/* Will add additional functionality for this later, currently unimplemented.
const filterWinner = prompt('Filter matches with no winner? (Y/N) : ');
console.clear();
const filterTeam = prompt('Filter team matches? (Y/N) : ');
console.clear();
*/

// Check for slp extension on files!
for (let k = 0; k < files.length; k++) {
    let temp = files[k].toString().split('.').pop();
    if (temp !== "slp") {
        files.splice(k, 1);
        k--;
    }
}

/* Will add additional functionality for this later, currently unimplemented.
if (filterWinner === "Y") {
    if (filterTeam === "Y") {
        // Remove team matches
    }
    // Remove matches with 'null data' here.
} else {
    totalFile = files.length;
}
*/

totalFile = files.length;
const chunkSize = totalFile / 20;
var i = Math.floor(1/chunkSize);

console.log("Parsing " + totalFile + " games within the directory " + replayDirectory);
if (totalFile > 500) {
    console.log("Warning. Attempting parse a large amount of Slippi files, this process can take up to 1 second for each game.")
}
calculateInfo(files);
console.log("\n");
// Creating CSV File here
console.clear();
const newfile = prompt('Enter output filename : ');
outputCSV(newfile, matchArray);
console.log("Done parsing and converting into CSV, exiting...")
console.log(matchArray[0]);

function outputCSV(filename, matchData) {
    outputData = "File,Date,Winner,StageID,P1 Code,P1 Character,P1 Damage,P1 Neutral Wins,P1 Kill Count,P1 Inputs per Minute," +
        "P2 Code,P2 Character,P2 Damage,P2 Neutral Wins,P2 Kill Count,P2 Inputs per Minute\n";

    matchData.forEach(match => {
        outputData += match.generateRow();
        outputData += "\n";
    })

    fs.writeFile(filename+".csv", outputData, function (err) {
        if (err) return console.log(err);
    });
}

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
        updateProgressBar();
        currFile++;
        const current_game = new SlippiGame(replayDirectory + file);
        const settings = current_game.getSettings();
        const metadata = current_game.getMetadata();
        const stats = current_game.getStats();
        let currmatch = new Match(file, metadata.startAt);
        matchArray.push(currmatch);

        if (metadata == null) {
            //console.log("null");
            skippedParsing++;
        } else {
            if (determineWin(stats.overall, 0)) {
                currmatch.setWinner(metadata.players[0].names.code);
            } else {
                currmatch.setWinner(metadata.players[1].names.code);
            }
            currmatch.setstage(settings.stageId);
            currmatch.setport1(metadata.players[0].names.code,settings.players[0].characterId);
            currmatch.setport2(metadata.players[1].names.code,settings.players[1].characterId);

            // Port 1 Data
            currmatch.setport1stats(stats.overall[0].totalDamage,stats.overall[0].inputsPerMinute.ratio,stats.overall[0].neutralWinRatio.count,stats.overall[0].killCount);
            // Port 2 Data
            currmatch.setport2stats(stats.overall[1].totalDamage,stats.overall[1].inputsPerMinute.ratio,stats.overall[1].neutralWinRatio.count,stats.overall[1].killCount);
        }
    })
}

function determineWin(statdata, userport) {
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

/*
// Update April 28th : Not using this function anymore, gonna parse all files in directory.
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

 */

/*
// Update April 28th : Not gonna be using player specific or character specific filtering now, parsing all files.
const yourCode = prompt('Your code : ');
console.clear();
const opponentCode = prompt('Opponent code : ');
console.clear();
const yourCharacterID = Number(prompt('Your character ID : '));
console.clear();
const opponentCharacterID = Number(prompt('Opponent character ID : ')); // Sheik 19 Falcon 0
console.clear();

 */

/*
// Update April 28th : Not looking for just win loss anymore, removing this method.
else {
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
 */

/* Refactored out for final product
console.log("Wins : " + yourWins + " | Losses : " + yourLoss + " | Skipped : " + skippedParsing);
*/