const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const myaudio= document.getElementById("myaudio");

async function startRecording() {
    videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });
    voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    let tracks = [...videoStream.getTracks(), ...voiceStream.getAudioTracks()];

    stream = new MediaStream(tracks);
    handleRecord({stream});
}

const handleRecord = function ({ stream }) {
    let recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };

    mediaRecorder.onstop = e => {
        const completeBlob = new Blob(recordedChunks, { type: "video/mp4" });
        video.src = URL.createObjectURL(completeBlob);
    }

    mediaRecorder.start(200);
}


start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
    startRecording();
})

stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
    mediaRecorder.stop();
    stream.getTracks().forEach(function(track){
        track.stop();
    });
})
