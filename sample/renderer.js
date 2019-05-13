"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("../player");
var talkOptions = {
    frameworkPath: './vendorEva/AquesTalk2Eva.framework/Versions/A/AquesTalk2Eva',
    phontPath: './vendorEva/phont/aq_f1c.phont',
    speed: 100,
    volume: 100,
};
var kanjiOptions = {
    frameworkPath: './vendorEva/AqKanji2Koe.framework/Versions/A/AqKanji2Koe',
    aqDictPath: './vendorEva/aq_dic_large',
    devKey: null,
};
var player = new player_1.AquesTalk2Player(talkOptions, kanjiOptions);
var fWords = document.getElementById('words');
var btnPlay = document.getElementById('play');
var btnRecord = document.getElementById('record');
var fPath = document.getElementById('path');
btnPlay.addEventListener('click', () => {
    player.play(fWords.value);
}, false);
btnRecord.addEventListener('click', () => {
    player.record(fWords.value, fPath.value);
}, false);
