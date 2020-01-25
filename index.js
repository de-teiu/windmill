const BUFFER_SIZE = 1024;

let audioAnalyser = null;
const wingDom = document.getElementById("wing");

window.onload = () => {
  document.getElementById("btnStart").addEventListener("click",(e)=>{
    const entranceDom = document.getElementById("entrance");
    entranceDom.parentNode.removeChild(entranceDom);
    activateMicrophone();
  });
};

/**
 * 音声認識プロセス
 * @param {*} e 
 */
const onAudioProcess = (e) => {  
  console.log("onAudioProcess");
  // 波形を解析
  //analyseAudio();
};

/**
 * 波形を解析してキャンバスに出力
 */
const analyseAudio = () => {
  console.log("analyseAudio");
  const spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
  audioAnalyser.getByteFrequencyData(spectrums);

  const isRotating = wingDom.classList.contains("animation");
  const spc = spectrums[0];
  console.log(spc);
  if (spc > 200 && !isRotating){
    wingDom.classList.remove("animation-willstop");
    wingDom.classList.add("animation");
  }else if(spc === 0 && isRotating){
    wingDom.classList.remove("animation");
    wingDom.classList.add("animation-willstop");
  }
  console.log("analyseAudio - 完了");
};

/**
 * マイク起動
 */
const activateMicrophone = () => {
  console.log("activateMicrophone");
  navigator.getUserMedia({audio: true,video:false},(stream) => {
    console.log("getUserMedia");
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    // 録音関連
    const scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
    const mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    // 音声解析関連
    /*
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 256;
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
    mediastreamsource.connect(audioAnalyser);
    */
    console.log("getUserMedia - 完了");
  },(error) =>{
    console.log(error);
  });
};