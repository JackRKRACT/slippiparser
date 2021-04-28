class Match {
    constructor(filename) {
        this.fname = filename;
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

    setstage(stageid) {
        this.stageid = stageid;
    }

    generateRow() {

        return 0;
    }
}