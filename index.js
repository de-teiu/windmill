const audioContext = new AudioContext();
const BUFFER_SIZE = 1024;

let audioAnalyser = null;

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

window.onload = () => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
  activateMicrophone();
};

/**
 * 音声認識プロセス
 * @param {*} e 
 */
const onAudioProcess = (e) => {  
  // 波形を解析
  analyseAudio();
};

/**
 * 波形を解析してキャンバスに出力
 */
const analyseAudio = () => {
  const fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
  const spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
  audioAnalyser.getByteFrequencyData(spectrums);
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  canvasContext.beginPath();

  spectrums.forEach((spectrum,index,array) => {
    const x = (index / spectrums.length) * canvas.width;
    const y = (1 - (spectrum / 255)) * canvas.height;
    if (index === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
    const f = Math.floor(index * fsDivN);
    if ((f % 500) === 0) {
      const text = (f < 1000) ? (f + ' Hz') : ((f / 1000) + ' kHz');
      canvasContext.fillRect(x, 0, 1, canvas.height);
      canvasContext.fillText(text, x, canvas.height);
    }
  });

  canvasContext.stroke();
  const TEXT_YS = ['1.00', '0.50', '0.00'];
  TEXT_YS.forEach(TEXT_Y => {
    const gy = (1 - parseFloat(TEXT_Y)) * canvas.height;
    canvasContext.fillRect(0, gy, canvas.width, 1);
    canvasContext.fillText(TEXT_Y, 0, gy);
  });
};

/**
 * マイク起動
 */
const activateMicrophone = () => {
  navigator.getUserMedia({audio: true,video:false},(stream) => {
    // 録音関連
    const scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
    const mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    // 音声解析関連
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 2048;
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
    mediastreamsource.connect(audioAnalyser);

  },(error) =>{
    console.log(error);
  });
};