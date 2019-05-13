import {AqKanji2Koe, AquesTalk10} from 'aquestalk-mac';
import Player from './player';

class AquesTalk10Player {
  private aquesTalk10;
  private aqKanji2Koe;
  private player;
  constructor(private talkOptions: aquestalk.AquesTalk10Options, private kanjiOptions: aquestalk.AqKanji2KoeOptions) {
    this.aquesTalk10 = new AquesTalk10(talkOptions.frameworkPath);
    if (talkOptions.devKey) {
      this.aquesTalk10.setDevKey(talkOptions.devKey);
    }
    if (talkOptions.usrKey) {
      this.aquesTalk10.setUsrKey(talkOptions.usrKey);
    }

    this.aqKanji2Koe = new AqKanji2Koe(kanjiOptions.frameworkPath, kanjiOptions.aqDictPath);
    if (kanjiOptions.devKey) {
      this.aqKanji2Koe.setDevKey(kanjiOptions.devKey);
    }

    this.player = new Player();
  }

  play(message: string): Promise<boolean> {
    const encoded = this.aqKanji2Koe.convert(message);
    return this.aquesTalk10.wave(encoded, this.talkOptions.options).then((bufWav) => {
      return this.player.play(bufWav, 100); // volume is set at wav generated
    });
  }

  record(message: string, wavFilePath: string): Promise<boolean> {
    const encoded = this.aqKanji2Koe.convert(message);
    return this.aquesTalk10.wave(encoded, this.talkOptions.options).then((bufWav) => {
      return this.player.record(wavFilePath, bufWav, 100); // volume is set at wav generated
    });
  }
}

export default AquesTalk10Player;
