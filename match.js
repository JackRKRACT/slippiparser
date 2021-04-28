class Match {
    constructor(filename, mdate) {
        this.fname = filename;
        this.mdate = mdate;
    }

    setWinner(wincode) {
        this.winner = wincode;
    }

    setport1(playercode, charnumber) {
        this.port1 = playercode;
        this.char1 = charnumber;
    }

    setport2(playercode, charnumber) {
        this.port2 = playercode;
        this.char2 = charnumber;
    }

    setport1stats(damage, ipm, neutralW, killcount) {
        this.p1damage = damage;
        this.p1ipm = ipm;
        this.p1nw = neutralW;
        this.p1kc = killcount;
    }

    setport2stats(damage, ipm, neutralW, killcount) {
        this.p2damage = damage;
        this.p2ipm = ipm;
        this.p2nw = neutralW;
        this.p2kc = killcount;
    }

    setstage(stageid) {
        this.stageid = stageid;
    }

    generateRow() {
        return (this.fname + "," + this.mdate + "," + this.winner + "," + this.stageid + "," +
            this.port1 + "," + this.char1 + "," + this.p1damage + "," + this.p1nw + "," + this.p1kc + "," + this.p1ipm + "," +
            this.port2 + "," + this.char2 + "," + this.p2damage + "," + this.p2nw + "," + this.p2kc + "," + this.p2ipm);
    }
}

module.exports = Match;