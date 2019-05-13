"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var WavEncoder = require('wav-encoder');
class Player {
    constructor() { }
    toArrayBuffer(bufWav) {
        const aBuffer = new ArrayBuffer(bufWav.length);
        const view = new Uint8Array(aBuffer);
        for (let i = 0; i < bufWav.length; ++i) {
            view[i] = bufWav[i];
        }
        return aBuffer;
    }
    play(bufWav, volume) {
        return new Promise((resolve, reject) => {
            const aBuffer = this.toArrayBuffer(bufWav);
            const audioCtx = new window.AudioContext();
            let sourceNode = null;
            let gainNode = null;
            let audioPlayNode = null;
            return audioCtx
                .decodeAudioData(aBuffer)
                .then((decodedData) => {
                const bufFrameCount = decodedData.length;
                const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);
                sourceNode = offlineCtx.createBufferSource();
                sourceNode.buffer = decodedData;
                gainNode = offlineCtx.createGain();
                gainNode.gain.value = volume;
                sourceNode.connect(gainNode);
                gainNode.connect(offlineCtx.destination);
                sourceNode.start(0);
                return offlineCtx.startRendering().then((renderedBuffer) => {
                    return new Promise((inResolve, inReject) => {
                        audioPlayNode = audioCtx.createBufferSource();
                        audioPlayNode.buffer = renderedBuffer;
                        audioPlayNode.connect(audioCtx.destination);
                        audioPlayNode.onended = () => {
                            inResolve(true);
                        };
                        audioPlayNode.start(0);
                    });
                });
            })
                .catch((err) => {
                return reject(err);
            })
                .finally(() => {
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
    record(wavFilePath, bufWav, volume) {
        return new Promise((resolve, reject) => {
            const aBuffer = this.toArrayBuffer(bufWav);
            const audioCtx = new window.AudioContext();
            let sourceNode = null;
            let gainNode = null;
            return audioCtx
                .decodeAudioData(aBuffer)
                .then((decodedData) => {
                const bufFrameCount = decodedData.length;
                const offlineCtx = new OfflineAudioContext(decodedData.numberOfChannels, bufFrameCount, decodedData.sampleRate);
                sourceNode = offlineCtx.createBufferSource();
                sourceNode.buffer = decodedData;
                gainNode = offlineCtx.createGain();
                gainNode.gain.value = volume;
                sourceNode.connect(gainNode);
                gainNode.connect(offlineCtx.destination);
                sourceNode.start(0);
                return offlineCtx.startRendering().then((renderedBuffer) => {
                    const audioData = {
                        sampleRate: renderedBuffer.sampleRate,
                        channelData: [],
                    };
                    for (let i = 0; i < renderedBuffer.numberOfChannels; i++) {
                        audioData.channelData[i] = renderedBuffer.getChannelData(i);
                    }
                    return WavEncoder
                        .encode(audioData)
                        .then((buffer) => {
                        return new Promise((inResolve, inReject) => {
                            fs.writeFile(wavFilePath, Buffer.from(buffer), 'binary', (err) => {
                                if (err) {
                                    return inReject(err);
                                }
                                return inResolve(true);
                            });
                        });
                    });
                });
            })
                .catch((err) => {
                return reject(err);
            })
                .finally(() => {
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
exports.default = Player;
