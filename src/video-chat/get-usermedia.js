function getUserMedia(){
  //console.log("Get user media method");
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  });
}

module.exports = getUserMedia;