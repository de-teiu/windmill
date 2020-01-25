const BUFFER_SIZE = 1024;

const wingDom = document.getElementById("wing");
//const valueDom = document.getElementById("value");

window.onload = () => {
  document.getElementById("btnStart").addEventListener("click", (e) => {
    const entranceDom = document.getElementById("entrance");
    entranceDom.parentNode.removeChild(entranceDom);
    activateMicrophone();
  });
};

/**
 * マイク起動
 */
const activateMicrophone = () => {
  console.log("activateMicrophone");
  console.log(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(
    stream => {
      console.log("getUserMedia");
      const audioContext = new(window.AudioContext || window.webkitAudioContext);
      const audioAnalyser = audioContext.createAnalyser();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      audioAnalyser.fftSize = 256;
      mediaStreamSource.connect(audioAnalyser);

      const scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
      audioAnalyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      //音声入力検知イベント
      scriptProcessor.onaudioprocess = (e) => {
        console.log("analyseAudio");
        const spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
        audioAnalyser.getByteFrequencyData(spectrums);

        const isRotating = wingDom.classList.contains("animation");
        const spc = spectrums[0];
        console.log(spc);
        //valueDom.innerHTML = spc;
        if (spc > 200 && !isRotating) {
          wingDom.classList.remove("animation-willstop");
          wingDom.classList.add("animation");
        } else if (spc < 100 && isRotating) {
          wingDom.classList.remove("animation");
          wingDom.classList.add("animation-willstop");
        }
        console.log("analyseAudio - 完了");
      };
      console.log("getUserMedia - 完了");
    }

  ).catch(error => {
    console.log(error);
  });
};