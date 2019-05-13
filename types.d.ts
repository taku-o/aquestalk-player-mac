// wav-encoder
declare namespace WavEncoder {
  export interface AudioData {
    sampleRate: number;
    channelData: Float32Array[];
  }
}

declare namespace aquestalk {
  export interface WaveOptions {
    bas: number;
    spd: number;
    vol: number;
    pit: number;
    acc: number;
    lmd: number;
    fsc: number;
  }

  export interface AquesTalk2Options {
    frameworkPath: string;
    phontPath: string;
    speed: number;
    volume: number;
  }
  export interface AquesTalk10Options {
    frameworkPath: string;
    devKey: string;
    usrKey: string;
    options: aquestalk.WaveOptions;
  }
  export interface AqKanji2KoeOptions {
    frameworkPath: string;
    aqDictPath: string;
    devKey: string;
  }
}
