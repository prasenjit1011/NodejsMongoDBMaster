const peerConnections = {};
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

const socket = io.connect(window.location.origin);
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let isBroadcaster = false;

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localVideo.srcObject = stream;

  socket.emit('broadcaster');
  isBroadcaster = true;

  socket.on('watcher', id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', id, event.candidate);
      }
    };

    peerConnection
      .createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(() => {
        socket.emit('offer', id, peerConnection.localDescription);
      });
  });

  socket.on('answer', (id, description) => {
    peerConnections[id].setRemoteDescription(description);
  });

  socket.on('candidate', (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on('disconnectPeer', id => {
    if (peerConnections[id]) {
      peerConnections[id].close();
      delete peerConnections[id];
    }
  });

}).catch(console.error);

socket.on('offer', (id, description) => {
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit('answer', id, peerConnection.localDescription);
    });

  peerConnection.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', id, event.candidate);
    }
  };
});

socket.on('broadcaster', () => {
  socket.emit('watcher');
});
