import {AqKanji2Koe, AquesTalk2} from 'aquestalk-mac';
import Player from './player';

class AquesTalk2Player {
  private aquesTalk2;
  private aqKanji2Koe;
  private player;
  constructor(private talkOptions: aquestalk.AquesTalk2Options, private kanjiOptions: aquestalk.AqKanji2KoeOptions) {
    this.aquesTalk2 = new AquesTalk2(talkOptions.frameworkPath);
    this.aqKanji2Koe = new AqKanji2Koe(kanjiOptions.frameworkPath, kanjiOptions.aqDictPath);
    if (kanjiOptions.devKey) {
      this.aqKanji2Koe.setDevKey(kanjiOptions.devKey);
    }

    this.player = new Player();
  }

  play(message: string): Promise<boolean> {
    const encoded = this.aqKanji2Koe.convert(message);
    return this.aquesTalk2.wave(encoded, this.talkOptions.phontPath, this.talkOptions.speed).then((bufWav) => {
      return this.player.play(bufWav, this.talkOptions.volume);
    });
  }

  record(message: string, wavFilePath: string): Promise<boolean> {
    const encoded = this.aqKanji2Koe.convert(message);
    return this.aquesTalk2.wave(encoded, this.talkOptions.phontPath, this.talkOptions.speed).then((bufWav) => {
      return this.player.record(wavFilePath, bufWav, this.talkOptions.volume);
    });
  }
}

export default AquesTalk2Player;
