var fs = require('fs');
var WavEncoder = require('wav-encoder');

class Player {
  constructor() {}

  private toArrayBuffer(bufWav: Buffer): ArrayBuffer {
    const aBuffer = new ArrayBuffer(bufWav.length);
    const view = new Uint8Array(aBuffer);
    for (let i = 0; i < bufWav.length; ++i) {
      view[i] = bufWav[i];
    }
    return aBuffer;
  }

  play(bufWav: Buffer, volume: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const aBuffer = this.toArrayBuffer(bufWav);

      // @ts-ignore
      const audioCtx = new window.AudioContext();
      let sourceNode: AudioBufferSourceNode = null;
      let gainNode: GainNode = null;
      let audioPlayNode: AudioBufferSourceNode = null;
      return audioCtx
        .decodeAudioData(aBuffer)
        .then((decodedData: AudioBuffer) => {
          const bufFrameCount = decodedData.length;
          const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);

          // source
          sourceNode = offlineCtx.createBufferSource();
          sourceNode.buffer = decodedData;
          // gain
          gainNode = offlineCtx.createGain();
          gainNode.gain.value = volume;

          // connect
          sourceNode.connect(gainNode);
          gainNode.connect(offlineCtx.destination);

          // and start
          sourceNode.start(0);

          // rendering
          return offlineCtx.startRendering().then((renderedBuffer: AudioBuffer) => {
            return new Promise((inResolve, inReject) => {
              // play voice
              audioPlayNode = audioCtx.createBufferSource();
              audioPlayNode.buffer = renderedBuffer;
              audioPlayNode.connect(audioCtx.destination);
              audioPlayNode.onended = () => {
                inResolve(true);
              };
              audioPlayNode.start(0);
            });
          }); // offlineCtx.startRendering
        })
        .catch((err: Error) => {
          return reject(err);
        })
        .finally(() => {
          // close audio context
          if (sourceNode) {
            sourceNode.buffer = null;
            sourceNode.disconnect();
          }
          if (gainNode) {
            gainNode.disconnect();
          }
          if (audioPlayNode) {
            audioPlayNode.buffer = null;
            audioPlayNode.disconnect();
          }
          audioCtx.close();
        });
    });
  }

  record(wavFilePath: string, bufWav: Buffer, volume: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const aBuffer = this.toArrayBuffer(bufWav);

      // @ts-ignore
      const audioCtx = new window.AudioContext();
      let sourceNode: AudioBufferSourceNode = null;
      let gainNode: GainNode = null;
      return audioCtx
        .decodeAudioData(aBuffer)
        .then((decodedData: AudioBuffer) => {
          const bufFrameCount = decodedData.length;
          const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);

          // source
          sourceNode = offlineCtx.createBufferSource();
          sourceNode.buffer = decodedData;
          // gain
          gainNode = offlineCtx.createGain();
          gainNode.gain.value = volume;

          // connect
          sourceNode.connect(gainNode);
          gainNode.connect(offlineCtx.destination);

          // and start
          sourceNode.start(0);

          // rendering
          return offlineCtx.startRendering().then((renderedBuffer: AudioBuffer) => {
            // create audioData parameter for wav-encoder
            const audioData: WavEncoder.AudioData = {
              sampleRate: renderedBuffer.sampleRate,
              channelData: [],
            };
            for (let i = 0; i < renderedBuffer.numberOfChannels; i++) {
              audioData.channelData[i] = renderedBuffer.getChannelData(i);
            }
            // create wav file.
            return WavEncoder
              .encode(audioData)
              .then((buffer: ArrayBuffer) => {
                return new Promise((inResolve, inReject) => {
                  fs.writeFile(wavFilePath, Buffer.from(buffer), 'binary', (err: Error) => {
                    if (err) {
                      return inReject(err);
                    }
                    return inResolve(true);
                  });
                });
              });
          }); // offlineCtx.startRendering
        })
        .catch((err: Error) => {
          return reject(err);
        })
        .finally(() => {
          // close audio context
          if (sourceNode) {
            sourceNode.buffer = null;
            sourceNode.disconnect();
          }
          if (gainNode) {
            gainNode.disconnect();
          }
          audioCtx.close();
        });
    });
  }
}

export default Player;
