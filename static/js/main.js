const socket = io();
const video = document.querySelector('video');

const pc = new RTCPeerConnection();

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
    })
    .catch(error => console.error(error));

pc.onicecandidate = event => {
    if (event.candidate) {
        socket.emit('candidate', event.candidate);
    }
};

socket.on('offer', async offer => {
    console.log(offer);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', answer => {
    console.log(answer);
    pc.setRemoteDescription(answer);
});

pc.ontrack = event => {
    video.srcObject = event.streams[0];
};

socket.emit('offer', pc.localDescription);
