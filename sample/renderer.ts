// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import {AquesTalk2Player} from '../player';

var talkOptions = {
  frameworkPath: '../vendorEva/AquesTalk2Eva.framework/Versions/A/AquesTalk2Eva',
  phontPath: '../vendorEva/phont/aq_f1c.phont',
  speed: 100,
  volume: 100,
};
var kanjiOptions = {
  frameworkPath: '../vendorEva/AqKanji2Koe.framework/Versions/A/AqKanji2Koe',
  aqDictPath: '../vendorEva/aq_dic_large',
  devKey: null,
};

var player = new AquesTalk2Player(talkOptions, kanjiOptions);

var fWords: any = document.getElementById('words');
var btnPlay = document.getElementById('play');
var btnRecord = document.getElementById('record');
var fPath: any = document.getElementById('path');

btnPlay.addEventListener(
  'click',
  () => {
    player.play(fWords.value);
  },
  false,
);

btnRecord.addEventListener(
  'click',
  () => {
    player.record(fWords.value, fPath.value);
  },
  false,
);
