import { Base64 } from 'js-base64';

export function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

export async function getAudioStream() {
  const navigatorAny = navigator as any;
  if (navigatorAny.mediaDevices === undefined) {
    navigatorAny.mediaDevices = {};
  }

  if (navigatorAny.mediaDevices.getUserMedia === undefined) {
    navigatorAny.mediaDevices.getUserMedia = function(constraints: any) {

      var getUserMedia =
      navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  const params = { audio: true, video: false };
  return navigator.mediaDevices.getUserMedia(params);
}

export function processAudioBufferToShazam(buffer: Float32Array) {
  const pcmBuffer = new ArrayBuffer(buffer.length * 2);
  const view = new DataView(pcmBuffer);
  floatTo16BitPCM(view, 0, buffer);

  return Base64.fromUint8Array(new Uint8Array(pcmBuffer))
}

export function playAudioBuffer(buffer: Float32Array, ctx: AudioContext = getAudioContext()) {
  const s = ctx.createBufferSource()
  const b = ctx.createBuffer(2, buffer.length, 44100)
  b.copyToChannel(buffer, 0)
  b.copyToChannel(buffer, 1)
  s.buffer = b;
  s.connect(ctx.destination)
  s.start()
}

export function getAudioContext() {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}