function disconnectCall(channelId)
{
  this.pc.close();
  try{
    
    this.localStream.getAudioTracks()[0].stop();
    this.localStream.getVideoTracks()[0].stop();
    
    this.remoteStream.getAudioTracks()[0].stop();
    this.remoteStream.getVideoTracks()[0].stop();
  } catch(e){console.error("Error while disconnecting call", e)}

  var channel = this.db.ref('video-channel/' + channelId);
  channel.remove();
}

module.exports = disconnectCall;