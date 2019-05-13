"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aquestalk_mac_1 = require("aquestalk-mac");
const player_1 = require("./player");
class AquesTalk2Player {
    constructor(talkOptions, kanjiOptions) {
        this.talkOptions = talkOptions;
        this.kanjiOptions = kanjiOptions;
        this.aquesTalk2 = new aquestalk_mac_1.AquesTalk2(talkOptions.frameworkPath);
        this.aqKanji2Koe = new aquestalk_mac_1.AqKanji2Koe(kanjiOptions.frameworkPath, kanjiOptions.aqDictPath);
        if (kanjiOptions.devKey) {
            this.aqKanji2Koe.setDevKey(kanjiOptions.devKey);
        }
        this.player = new player_1.default();
    }
    play(message) {
        const encoded = this.aqKanji2Koe.convert(message);
        return this.aquesTalk2.wave(encoded, this.talkOptions.phontPath, this.talkOptions.speed)
            .then((bufWav) => {
            return this.player.play(bufWav);
        });
    }
    record(message, wavFilePath) {
        const encoded = this.aqKanji2Koe.convert(message);
        return this.aquesTalk2.wave(encoded, this.talkOptions.phontPath, this.talkOptions.speed)
            .then((bufWav) => {
            return this.player.record(wavFilePath, bufWav);
        });
    }
}
exports.default = AquesTalk2Player;
