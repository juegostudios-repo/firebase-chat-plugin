var channelId;
var self;
function createPeerConnection(channelid, slf)
{
  channelId = channelid;
  //console.log("Create peer connection ",channelId);
  self = slf;
 try{  
    self.pc = new RTCPeerConnection(null);
    self.pc.onicecandidate = handleIceCandidate;
    self.pc.onaddstream = handleRemoteStreamAdded;
    self.pc.onremovestream = handleRemoteStreamRemoved;

  } catch(e){
    console.log("Failed to create Peer Connection");
    console.log(e);
    return false;
  }
  return true;
}

function handleIceCandidate(event)
{
  if (event.candidate) {
    console.log("Addding ice candidate to db");
    var iceCandidate = {
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    };
    self.db.ref('/video-channel/' + channelId + '/icecandidates/'+ self.user.uid).set(iceCandidate);
  } else {
    console.log('End of candidates.');
  }
}

function handleRemoteStreamAdded(event) {
  console.log("Remote stream added");
  self.remoteStreamSrc = window.URL.createObjectURL(event.stream);
  self.remoteStream = (event.stream);
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

module.exports = createPeerConnection;