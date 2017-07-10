var getUserMedia = require('./get-usermedia');
var createPeerConnection = require('./create-peer-connection');

var initBy;

function acceptCall(channelId, initiatedBy)
{
  initBy = initiatedBy;
  return new Promise((resolve, reject)=>{
    getUserMedia().then(
      (stream)=>{
        this.localStreamSrc = window.URL.createObjectURL(stream);
        console.log(this.localStream);
        this.localStream = (stream);
        continueAcceptCall(this, channelId, initiatedBy);
        resolve({ localVideoSrc : this.localStreamSrc})
      }
    ).catch(err=>{
      console.log("Not able to get User media", err);
    });
  });
}

function continueAcceptCall(self, channelId, initiatedBy)
{
  var createdConnection = createPeerConnection(channelId, self);
  
  if(!createdConnection){
    return console.log("Failed to create Peer Connection");
  }
  
  //addIceCandidate(self, channelId, initiatedBy);
  acceptOffer(self, channelId);
}

function addIceCandidate(self, channelId, initiatedBy)
{
  var remoteCandidate = self.db.ref('/video-channel/' + channelId + '/icecandidates/'+ initiatedBy);
  remoteCandidate.once('value').then((snapshot)=>{
    var message = snapshot.val();
    if(! message){
      console.error('Failed to add ICE Candidate. Ice candidate not set');
    } else{
      try{
        console.log("ICE Candidate message", message);
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate
        });
        self.pc.addIceCandidate(candidate).then(msg=>{console.log("Added ICE candidates successfuly")}).catch(err=>console.log(err));
      } catch(e){
        console.error('Failed to ICE Candidate while accepting the call.', e);
      }
    }
  });
  //acceptOffer(self, channelId);
}

function acceptOffer(self, channelId)
{
  var remoteOffer = self.db.ref('/video-channel/' + channelId + '/offer');
  remoteOffer.once('value').then((snapshot)=>{
    var message = JSON.parse(snapshot.val());

    if(! message){
      console.error('Failed to respond to offer. Offer is not set');
    } else{
      try{
        console.log("Adding Remote Description offer ", message);
        self.pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer(self, channelId);   
      } catch(e){
        console.error('Failed to add remoteDescription offer.', e);
      }
    }
  });
}
var sl, channelId;
function doAnswer(self, channelid)
{
  sl = self;
  channelId = channelid;
  self.pc.addStream(self.localStream);
  self.pc.createAnswer().then(setLocalDescAndSendMessage, function(err){ console.log("Failed create answer", err); })
}

function setLocalDescAndSendMessage(description)
{
  console.log("Setting local description at receiver end");
  sl.pc.setLocalDescription(description).then(res=>{
    addIceCandidate(sl, channelId, initBy);
  });
  sl.db.ref('/video-channel/' + channelId + '/answer').set(JSON.stringify(description));
}

module.exports = acceptCall;