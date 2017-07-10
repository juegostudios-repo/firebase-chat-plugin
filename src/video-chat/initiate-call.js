var getUserMedia = require('./get-usermedia');
var createPeerConnection = require('./create-peer-connection');

function initiateCall(uid)
{
  return new Promise((resolve, reject)=>
    getUserMedia().then(
      (stream)=>{
        this.localStreamSrc = window.URL.createObjectURL(stream);
        this.localStream = (stream);
        var cid = continueCall(this, uid);
        if(cid){
          resolve({ channelId: cid, message: "Channel is created for video call", localVideoSrc: this.localStreamSrc});
        } else{
          reject({message: "failed to create channel for video call"});
        }
      }
    ).catch(err=>{
      console.log("Not able to get User media", err);
      reject(err);
    })
  );
}
var sl;
var channelId;
var otherUserId;

function continueCall(self, uid)
{
  sl = self;
  channelId = sl.db.ref().push().key;
  otherUserId = uid;
  var createdConnection = createPeerConnection(channelId, sl);
  
  if(!createdConnection){
    return console.log("Failed to create Peer Connection");
  }
  self.pc.addStream(self.localStream);
  self.pc.createOffer(setLocalDescAndSendMessage, function(err){ console.log("Failed create offer"); })
  return channelId;
}

function setLocalDescAndSendMessage(description)
{
  sl.pc.setLocalDescription(description);
  sl.db.ref('/video-channel/' + channelId + '/offer' ).set(JSON.stringify(description));//.then(res=>{ console.log("pushed offer "+channelId, res) }).catch(err=>{ console.log("Failed to set offer"); });
  pushChannelIdToReceiver(sl);
}

function pushChannelIdToReceiver(self)
{
  self.db.ref('/users/' + otherUserId)
  .once('value')
  .then(result => {
    var key;
    result.forEach(childKey => {
      key = childKey.getKey()
    })
    var channelObj = {
      channelId: channelId,
      initiatedBy: self.user.uid
    }
    var pushKey = self.db.ref('/users/' + otherUserId + '/' + key + '/incomingCall/').push(channelObj).key;
    try{
      setTimeout(()=>{
        self.db.ref('/users/' + otherUserId + '/' + key + '/incomingCall/'+pushKey).remove();
      }, 30000)
    } catch(e){ console.log("Tried deleting call details...."); }
  });

  startListeningToAnswer(self);
}

function startListeningToAnswer(self)
{
  // Waiting for answer
  console.log("Waiting for answer");
  var remoteCandidate = self.db.ref('/video-channel/' + channelId + '/icecandidates/'+ otherUserId);
  var answer = self.db.ref('/video-channel/' + channelId + '/answer');
  
  answer.on('value', (snapshot)=>{
    var message_answer = JSON.parse(snapshot.val()) ;
    if(message_answer){
      console.log("Setting remote description");
      self.pc.setRemoteDescription(new RTCSessionDescription(message_answer));
    }
  });
  
  remoteCandidate.on('value', (snap)=>{
    var candidate = snap.val();;
    //Adding other candidate
    if(candidate){
      var cand = new RTCIceCandidate({
        sdpMLineIndex: candidate.label,
        candidate: candidate.candidate
      });
      console.log("Adding Ice candidate");
      self.pc.addIceCandidate(cand);
      // Answer
      // Answer End
    }// If candidate end
  });
}

module.exports = initiateCall;