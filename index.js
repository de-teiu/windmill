/**
 * 初期化処理
 */
window.onload = () => {
  /**
   * 初期画面タップイベント
   */
  document.getElementById("btnStart").addEventListener("click", (e) => {
    const entranceDom = document.getElementById("entrance");
    entranceDom.parentNode.removeChild(entranceDom);
    //マイク起動
    activateMicrophone();
  });
};

/**
 * マイク起動
 */
const activateMicrophone = () => {
  const wingDom = document.getElementById("wing");
  const BUFFER_SIZE = 1024;

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(
    stream => {
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
        const spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
        audioAnalyser.getByteFrequencyData(spectrums);

        const isRotating = wingDom.classList.contains("animation");
        const spc = spectrums[0];
        if (spc > 200 && !isRotating) {
          wingDom.classList.remove("animation-willstop");
          wingDom.classList.add("animation");
        } else if (spc < 100 && isRotating) {
          wingDom.classList.remove("animation");
          wingDom.classList.add("animation-willstop");
        }
      };
    }

  ).catch(error => {
    console.log(error);
  });
};